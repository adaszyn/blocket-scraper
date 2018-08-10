const knexConfigs = require('./knexfile');
const NODE_ENV = process.env.NODE_ENV;
const config = NODE_ENV === 'production'
  ? knexConfigs.production
  : knexConfigs.development;

const knex = require('knex')(config);

module.exports = knex;