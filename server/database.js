module.exports = connection => ({
  expenses: require('./expense').database(connection),
  categories: require('./category').database(connection),
  users: require('./authentication').database(connection),
});
