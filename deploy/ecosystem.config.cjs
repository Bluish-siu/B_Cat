// PM2 keeps the website server running on the VPS and restarts it after crashes or reboots.
//   pm2 start deploy/ecosystem.config.cjs     (first time)
//   pm2 reload bcat-website                   (after an update; deploy/update.sh does this)
//   pm2 logs bcat-website                     (see leads, errors)
module.exports = {
  apps: [{
    name: 'bcat-website',
    cwd: __dirname + '/..',
    script: 'server.js',
    env: { NODE_ENV: 'production', PORT: 3000 },   // change PORT if 3000 is used by another app on the VPS
    max_memory_restart: '300M',
    time: true
  }]
};
