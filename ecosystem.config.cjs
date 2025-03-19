module.exports = {
  apps: [{
    name: "snailshare",
    script: "app.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development"
    }
  }]
} 