const pg = require('pg-promise')();

module.exports = connection => {
  const db = pg(connection);

  return {
    one (id) {
      return db.oneOrNone('select * from categories where id = $1', id);
    },

    search (name, userId) {
      const qry = 'select * from categories ' +
        'where userId = $1 and name like \'%' + name + '%\'';
      return db.any(qry, userId);
    },

    create (name, userId) {
      const qry = 'insert into categories(name, userId) values($1, $2) returning *';
      return db.oneOrNone(qry, [name, userId]);
    },

    get (name, userId) {
      return db.oneOrNone(
        'select * from categories where name = $1 and userId = $2',
        [name, userId]
      );
    },

    update (id, name) {
      return db.one('update categories set name = $1 where id = $2 returning *', [name, id]);
    },

    destroy (id) {
      return db.one('delete from categories where id = $1 returning *', id);
    },
  };
};
