const router = require('koa-router');

const route = router();

module.exports = database => {
  const handlers = require('./handlers')(database);

  route.get('/', handlers.home);

  return route.routes();
};
