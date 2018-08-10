require('dotenv').config()

const env = process.env;

const DB_HOST = env.DB_HOST;
const DB_USER = env.DB_USER;
const DB_NAME = env.DB_NAME;
const DB_PASS = env.DB_PASS;

console.log({
    DB_USER, DB_HOST, DB_NAME, DB_PASS
})
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user:     DB_USER,
      password: DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
        host: DB_HOST,
        database: DB_NAME,
        user:     DB_USER,
        password: DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
