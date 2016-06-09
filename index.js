const koa = require('koa');
const config = require('./config');
const routes = require('./server/routes');
const database = require('./server/database');

const app = koa();
const dbSingleton = database(config.database);
const appRoutes = routes(dbSingleton);

app.use(appRoutes);
app.listen(config.port);
