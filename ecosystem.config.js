module.exports = {
    apps: [
        {
            name: 'BLOCKET-SCRAPER',
            script: 'cron-service.js',
        }
    ],
    deploy: {
        production: {
            user: 'wojtek',
            host: process.env.EC2_INSTANCE_IP,
            ref: 'origin/master',
            repo: 'git@github.com:wojciechAdaszynski/blocket-scraper.git',
            path: '/opt/blocket-scraper',
            'post-deploy': 'NODE_ENV=production npm install && npm run migrate && pm2 reload ecosystem.config.js --env production --update-env'
        }
    }
};
