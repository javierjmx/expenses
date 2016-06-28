const moment = require('moment');
const errors = require('../errors');

module.exports = {
  * create (next) {
    const quantity = this.query.quantity;
    const categoryId = this.query.category_id;
    const date = moment(this.query.date);
    const category = yield this.database.categories.one(categoryId);
    const user = this.state.user;

    if (!category || user.id !== category.userid) {
      this.throw(errors.categoryNotFound);
    }

    const expense = yield this.database.expenses.create(quantity, categoryId, date);

    this.body = expense;
  },

  * list (next) {
    const start = moment(this.query.start);
    const end = moment(this.query.end);
    const categoryId = this.query.category_id;
    const userId = this.state.user.id;
    const expenses = yield this.database.expenses.list(start, end, userId);

    if (!isNaN(categoryId)) {
      this.body = expenses.filter(expense => expense.categoryId === categoryId);
    } else {
      this.body = expenses;
    }
  },

  * one (next) {
    const id = this.params.id;
    const userId = this.state.user.id;
    const expense = yield this.database.expenses.one(id, userId);

    if (!expense) {
      this.throw(errors.expenseNotFound);
    }

    this.body = expense;
  },

  * update (next) {
    const id = this.params.id;
    const quantity = this.query.quantity;
    const categoryId = this.query.category_id;
    const date = moment(this.query.date);
    const currentExpense = yield this.database.expenses.get(id);
    const user = this.state.user;

    if (!currentExpense) {
      this.throw(errors.expenseNotFound);
    }

    const currentCategory = yield this.database.categories.one(currentExpense.categoryId);

    if (user.id !== currentCategory.userId) {
      this.throw(errors.expenseNotFound);
    }

    if (categoryId && categoryId !== currentCategory.id) {
      const newCategory = yield this.database.categories.one(categoryId);

      if (user.id !== newCategory.userId) {
        this.throw(errors.categoryNotFound);
      }
    }

    const newExpense = {
      quantity: quantity || currentExpense.quantity,
      categoryId: categoryId || currentExpense.categoryId,
      date: date || currentExpense.date,
    };

    this.body = yield this.database.expenses.update(id, newExpense);
  },

  * destroy (next) {
    const expenseId = this.params.id;
    const expense = yield this.database.expenses.get(expenseId);
    const user = this.state.user;

    if (!expense) {
      this.throw(errors.expenseNotFound);
    }

    const category = yield this.database.categories.one(expense.categoryId);

    if (user.id !== category.userId) {
      this.throw(errors.expenseNotFound);
    }

    this.body = yield this.database.expenses.destroy(expenseId);
  },
};
