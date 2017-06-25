const CronJob = require('cron').CronJob;
const { scrapeBlocket }  = require('./blocket-scraper')

new CronJob(`0 */${process.env.CRON_FREQUENCY} * * * *`, scrapeBlocket, null, true, 'America/Los_Angeles');