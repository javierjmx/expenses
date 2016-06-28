const pg = require('pg-promise')();

module.exports = connection => {
  const db = pg(connection);

  return {
    create (quantity, categoryId, date) {
      const qry = 'insert into expenses(quantity, categoryId, date) ' +
        'values($1, $2, $3) returning *';

      return db.one(qry, [quantity, categoryId, date]);
    },

    list (start, end, userId) {
      const qry = 'select * from expenses where ' +
        '$1 <= date and date <= $2 and ' +
        'categoryId in (select id from categories where userid = $3)';
      return db.any(qry, [start, end, userId]);
    },

    one (id, userId) {
      const qry = 'select * from expenses where ' +
        'id = $1 and ' +
        'categoryId in (select id from categories where userid = $2)';
      return db.oneOrNone(qry, [id, userId]);
    },

    update (id, updates) {
      const qry = 'update expenses set ' +
        'quantity = $1, date = $2, categoryId = $3 ' +
        'where id = $4 ' +
        'returning *';
      return db.one(qry, [updates.quantity, updates.date, updates.categoryId, id]);
    },

    destroy (id) {
      return db.one('delete from expenses where id = $1', id);
    }
  };
};
