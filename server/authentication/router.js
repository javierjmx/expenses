const jsonBody = require('koa-json-body');
const router = require('koa-router');

module.exports = secret => {
  const handlers = require('./handlers')(secret);
  const route = router();

  route.use(jsonBody());
  route.post('/authenticate', handlers.authenticate);
  route.post('/register', handlers.register);

  return route;
};
