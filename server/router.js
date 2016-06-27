const router = require('koa-router');
const handlers = require('./handlers');

module.exports = prefix => {
  const route = router({ prefix });

  route.post('/expense/create', handlers.insertExpense);
  route.get('/expenses', handlers.getExpenses);
  route.get('/categories/search', handlers.searchCategories);
  route.post('/categories/create', handlers.createCategory);

  return route;
};
