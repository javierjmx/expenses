const router = require('koa-router');
const handlers = require('./handlers');
const validators = require('./validators');

module.exports = prefix => {
  const route = router({ prefix });

  route.get('/', handlers.list);
  route.post('/', validators.query, handlers.create);
  route.get('/:id', validators.params, handlers.one);
  route.put('/:id', validators.query, handlers.update);
  route.del('/:id', validators.params, handlers.destroy);

  return route;
};
