const CronJob = require('cron').CronJob;
const { scrapeBlocket }  = require('./blocket-scraper')
require('dotenv').config()

new CronJob(`0 */5 * * * *`, scrapeBlocket, null, true, 'America/Los_Angeles');