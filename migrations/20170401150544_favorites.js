
exports.up = function(knex) {
  return knex.schema.createTable('favorites', table => {
    table.increments()
    table.integer('book_id')
    .notNullable()
    .references('books.id')
    // .inTable('books')
    .onDelete('CASCADE')

    table.integer('user_id')
    .notNullable()
    .references('users.id')
    // .inTable('users')
    .onDelete('CASCADE')

    table.timestamps(true, true)
    // table.index(['book_id', 'user_id'], 'index')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites')
};
