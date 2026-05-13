module.exports = {
  apps: [
    {
      name: "yatma",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/yatma",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
