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
    proxy_pass http://192.168.1.21:8800;
  }

  location / {
    proxy_pass http://192.168.1.21:8080;
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
