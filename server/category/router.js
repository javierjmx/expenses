const router = require('koa-router');
const handlers = require('./handlers');

module.exports = prefix => {
  const route = router({ prefix });

  route.get('/', handlers.list);
  route.post('/', handlers.create);
  route.get('/:id', handlers.one);
  route.put('/:id', handlers.update);
  route.del('/:id', handlers.destroy);

  return route;
};
