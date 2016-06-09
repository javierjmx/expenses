const pg = require('pg-promise')();

module.exports = connection => {
  const db = pg(connection);

  return {
    getUsers () {
      return db.any('select * from users');
    }
  };
};
