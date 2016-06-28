const pg = require('pg-promise')();

module.exports = connection => {
  const db = pg(connection);

  return {
    one (email) {
      return db.oneOrNone('select * from users where email = $1', email);
    },

    create (email, hash) {
      const qry = 'insert into users(email, passhash) values($1, $2) returning id, email';
      return db.one(qry, [email, hash]);
    },
  };
};
