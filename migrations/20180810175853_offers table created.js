
exports.up = function(knex, Promise) {
    return knex.schema.withSchema('public').createTable('offers', function (table) {
        table.increments();
        table.string('title', 256);
        table.string('rooms', 256);
        table.string('size', 256);
        table.string('rent', 256);
        table.string('link', 256);
        table.string('publish_date', 256);
        table.string('image_url', 256);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('offers')
};
