# switch api proxy
the way to switch api proxy

# config nginx.conf
- find nginx config `nginx -t` 
- vim replace tn - with r
- define port 30000
- replace ip with my ip (`ifconfig | grep 192`)

```
server {
  listen 30000;
  server_name localhost;

  location ~ ^/api/0\.2/
  {
    proxy_pass http://www.t4.meijian.tech;
    rewrite /api/(.*)/(.*)$ /api/$1/$2 break;
  }
  location /edit {
    proxy_pass http://192.168.1.21:8800/;
  }
  location / {
    proxy_pass http://192.168.1.21:8080;
  }
}
```

```
// nginx 一个端口配置两个应用最简化配置文件
server {
  listen 30000;   // 本地某个端口，不要被其他占用，不同server_name 无所谓
  server_name localhost;
  
  set $localIP 192.168.1.21;
  
  // 这只是主应用上的API配置，如果其他系统也要一起访问再加
  location ~ ^/api/0\.2/
  {
    proxy_pass http://www.t3.meijian.tech;   // 更改这里的值nginx relaod即可切换环境
    rewrite /api/(.*)/(.*)$ /api/$1/$2 break;
  }
  
  // 编辑工具系统的目录配置
  location /edit/ {
    proxy_pass http://$localIP:8800/;
  }

  // 主应用系统的目录配置
  location / {
    proxy_pass http://$localIP:8080;
  }
}
```

others:
- find bin directory `which nginx`
- find process `ps aux | grep nginx`

# execute
```
nginx
nginx -s reload
```
