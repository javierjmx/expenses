const pg = require('pg-promise')();

module.exports = connection => {
  const db = pg(connection);

  return {
    insertExpense (quantity, categoryId, date) {
      const qry = 'insert into expenses(quantity, categoryId, date) ' +
        'values($1, $2, $3) returning *';

      return db.one(qry, [quantity, categoryId, date]);
    },

    getExpensesBetween (start, end, userId) {
      const qry = 'select * from expenses where ' +
        '$1 <= date and date <= $2 and ' +
        'categoryId in (select id from categories where userId = $3)';
      return db.any(qry, [start, end, userId]);
    },

    searchCategoriesByName (name, userId) {
      const qry = 'select * from categories ' +
        'where userId = $1 and name like \'%' + name + '%\'';
      return db.any(qry, userId);
    },

    createCategory (name, userId) {
      const qry = 'insert into categories(name, userId) values($1, $2) returning *';
      return db.one(qry, [name, userId]);
    },

    getUserByEmail (email) {
      return db.oneOrNone('select * from users where email = $1', email);
    },

    createUser (email, hash) {
      const qry = 'insert into users(email, passhash) values($1, $2) returning id, email';
      return db.one(qry, [email, hash]);
    },
  };
};
