module.exports = {
  apps: [{
    name: 'noor-backend',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    error_file: '/home/ec2-user/.pm2/logs/noor-backend-error.log',
    out_file: '/home/ec2-user/.pm2/logs/noor-backend-out.log',
    time: true,
  }],
};
