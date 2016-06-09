module.exports = database => ({
  * home (next) {
    const news = yield database.getUsers();
    this.body = news;
  }
});
