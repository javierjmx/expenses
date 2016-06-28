const errors = require('../errors');

module.exports = {
  * create (next) {
    this.checkQuery('quantity').isNumeric();
    this.checkQuery('category_id').isNumeric();
    this.checkQuery('date').optional().isDate();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },

  * list (next) {
    this.checkQuery('start').optional().isDate();
    this.checkQuery('end').optional().isDate();
    this.checkQuery('category_id').optional().isNumeric();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },

  * idParam (next) {
    this.checkParams('id').isInt();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },

  * update (next) {
    this.checkParams('id').isInt();
    this.checkQuery('quantity').optional().isNumeric();
    this.checkQuery('category_id').optional().isNumeric();
    this.checkQuery('date').optional().isDate();

    if (this.errors) {
      this.throw(errors.invalidParams);
    }

    yield next;
  },
};
