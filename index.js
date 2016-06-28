const koa = require('koa');
const validate = require('koa-validate');
const config = require('./config');
const server = require('./server');

const app = koa();
const appRouter = server.router('/api');
const auth = server.authentication.middleware(config.secret);

app.context.database = server.database(config.database);

validate(app);
app.use(auth.router.routes());
app.use(auth.authorize);
app.use(appRouter.routes());

app.listen(config.port);
