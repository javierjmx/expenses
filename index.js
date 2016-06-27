const koa = require('koa');
const config = require('./config');
const server = require('./server');
const API_PREFIX = '/api';

const app = koa();
const appRouter = server.router(API_PREFIX);
const auth = server.authentication(config.secret);

app.context.database = server.database(config.database);

app.use(auth.router.routes());
app.use(auth.middleware);
app.use(appRouter.routes());

app.listen(config.port);
