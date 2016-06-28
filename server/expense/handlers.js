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
      this.body = expenses.filter(expense => expense.categoryid === categoryId);
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
    const user = this.state.user;
    const currentExpense = yield this.database.expenses.one(id, user.id);

    if (!currentExpense) {
      this.throw(errors.expenseNotFound);
    }

    const currentCategory = yield this.database.categories.one(currentExpense.categoryid);

    if (user.id !== currentCategory.userid) {
      this.throw(errors.expenseNotFound);
    }

    if (categoryId && categoryId !== currentCategory.id) {
      const newCategory = yield this.database.categories.one(categoryId);

      if (user.id !== newCategory.userid) {
        this.throw(errors.categoryNotFound);
      }
    }

    const newExpense = {
      quantity: quantity || currentExpense.quantity,
      categoryId: categoryId || currentExpense.categoryid,
      date: date || currentExpense.date,
    };

    this.body = yield this.database.expenses.update(id, newExpense);
  },

  * destroy (next) {
    const expenseId = this.params.id;
    const user = this.state.user;
    const expense = yield this.database.expenses.one(expenseId, user.id);

    if (!expense) {
      this.throw(errors.expenseNotFound);
    }

    const category = yield this.database.categories.one(expense.categoryid);

    if (user.id !== category.userid) {
      this.throw(errors.expenseNotFound);
    }

    this.body = yield this.database.expenses.destroy(expenseId);
  },
};
