const router = require('koa-router');
const expenses = require('./expense');
const categories = require('./category');

module.exports = prefix => {
  const route = router({ prefix });

  route.use(expenses.router('/expenses').routes());
  route.use(categories.router('/categories').routes());

  return route;
};
