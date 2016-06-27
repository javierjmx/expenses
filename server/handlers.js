const moment = require('moment');

module.exports = {
  * insertExpense (next) {
    const quantity = Number(this.query.quantity);
    const categoryId = Number(this.query.category_id);
    const date = moment(this.query.date);

    if (isNaN(quantity) || quantity <= 0) {
      this.throw(400, 'Quantity must be positive.');
    }

    if (isNaN(categoryId)) {
      this.throw(400, 'Required parameter category_id must be a number');
    }

    if (!date.isValid()) {
      this.throw(400, 'Invalid date.');
    }

    const expense = yield this.database.insertExpense(quantity, categoryId, date);

    this.body = expense;
  },

  * getExpenses (next) {
    const start = this.query.start;
    const end = this.query.end;
    const userId = this.state.userId;
    const expenses = yield this.database.getExpensesBetween(start, end, userId);

    this.body = expenses;
  },

  * searchCategories (next) {
    const name = this.query.q;
    const userId = this.state.user.id;
    const categories = yield this.database.searchCategoriesByName(name, userId);

    this.body = categories;
  },

  * createCategory (next) {
    const name = this.query.name;
    const userId = this.state.user.id;

    if (!name) {
      this.throw(400, 'Required parameters: name.');
    }

    const category = yield this.database.createCategory(name, userId);

    this.body = category;
  },
};
