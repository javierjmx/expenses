const errors = require('../errors');

module.exports = {
  * params (next) {
    this.checkParams('id').isInt();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },

  * query (next) {
    this.checkQuery('name').notEmpty();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },
};
