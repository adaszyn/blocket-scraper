const CronJob = require('cron').CronJob;
const { scrapeBlocket }  = require('./blocket-scraper')

new CronJob(`0 */3 * * * *`, scrapeBlocket, null, true, 'America/Los_Angeles');