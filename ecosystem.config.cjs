module.exports = {
  apps: [{
    name: "snailshare",
    script: "dist/app.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
      MAX_FILE_SIZE: "1000000000" // 1GB
    }
  }]
} 