const errors = require('../errors');

module.exports = {
  * list (next) {
    const name = this.query.q;
    const userId = this.state.user.id;
    const categories = yield this.database.categories.search(name, userId);

    this.body = categories;
  },

  * one (next) {
    const categoryId = this.params.id;
    const category = yield this.database.categories.one(categoryId);
    const user = this.state.user;

    console.log(category, user);
    if (!category || user.id !== category.userid) {
      this.throw(errors.categoryNotFound);
    }

    this.body = category;
  },

  * create (next) {
    const name = this.query.name;
    const userId = this.state.user.id;

    if (yield this.database.categories.get(name, userId)) {
      this.throw(errors.invalidName);
    }

    this.body = yield this.database.categories.create(name, userId);
  },

  * update (next) {
    const categoryId = this.params.id;
    const category = yield this.database.categories.one(categoryId);
    const name = this.query.name;
    const user = this.state.user;

    if (!category || user.id !== category.userid) {
      this.throw(errors.categoryNotFound);
    }

    if (name !== category.name) {
      this.body = yield this.database.categories.update(categoryId, name);
    } else {
      this.body = category;
    }
  },

  * destroy (next) {
    const categoryId = this.params.id;
    const category = yield this.database.categories.one(categoryId);
    const user = this.state.user;

    if (!category || user.id !== category.userid) {
      this.throw(errors.categoryNotFound);
    }

    this.body = yield this.database.categories.destroy(categoryId);
  },
};
