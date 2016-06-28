module.exports = {
  middleware (secret) {
    return {
      router: require('./router')(secret),
      authorize: require('./middleware')(secret),
    };
  },
  database: require('./database'),
};
