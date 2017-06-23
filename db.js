const knex = require('knex')({
    client: 'pg',
    connection: {
        host : process.env.DB_HOST,
        user : 'db_admin',
        password : process.env.DB_PASS,
        database : 'blocket-scraper'
    }
});

module.exports = knex