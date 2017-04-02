'use strict';

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev',
    // pool: {
    //   min: 2,
    //   max: 10
    // },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  },
test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
    // pool: {
    //   min: 2,
    //   max: 10
    // },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  }
};
