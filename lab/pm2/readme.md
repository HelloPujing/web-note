# 启动
```
(app = app_name|id)
pm2 start app
pm2 start app --name alia
```

# cluster模式
```
pm2 start app -i 0 // cluster 模式，最大核数
pm2 scale app 2 // 升/降到2核
pm2 scale app +2 // 加两核
```

# 重载
```
pm2 restart app
pm2 reload app
```

# 停止|删除
```
pm2 stop app
pm2 delete app
pm2 delete all
```

# 查看
```
pm2 list|ls|status
pm2 jlist
pm2 prettylist
```

# 日志
```
pm2 logs
pm2 logs [name|id]
pm2 logs --line 200
pm2 flush //输出 app-out app-error
pm2 reloadLogs // 配合logrotate很好用
```
`pm2 install pm2-logrotate`

# monitor
```
pm2 monitor
```

# 通信
```
pm2 sendSignal sigUsr app
```


# 多应用脚本配置
```
pm2 ecosystem
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
pm2 start process.yml
```


