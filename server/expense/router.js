const router = require('koa-router');
const handlers = require('./handlers');
const validators = require('./validators');

module.exports = prefix => {
  const route = router({ prefix });

  route.get('/', validators.list, handlers.list);
  route.post('/', validators.create, handlers.create);
  route.get('/:id', validators.idParam, handlers.one);
  route.put('/:id', validators.update, handlers.update);
  route.del('/:id', validators.idParam, handlers.destroy);

  return route;
};
