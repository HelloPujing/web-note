# Redis
- npm install -g redis
- npm install -g gcc

# download
- from official website
- cd xxx

# install
- make (src下生成 redis-cli redis-server 等源码)
- 其中，src下有个redis.conf是配置文件原型
- sudo make install (安装到user/local/bin)

# redis-server
- 验证 which redis-server
- 帮助 redis-server --help
- redis-server config

# redis-cli
- 验证 which redis-cli
- 帮助 redis-cli --help
- redis-cli可直接连接，如果默认port被改动的话，需要指定port
- redis-cli -h 127.0.0.1 -p 6379

# redis-cli 测试数据类型 string
- 定义 set string1 xxx
- 获取 get string1
- 自增 incr string1
- 减少 decrby string1 2
 
# redis-cli 测试数据类型 list
- 左推入 lpush list1 1
- 左推入 lpush list1 2
- 看长度 llen list1 // 2
- 右推出 rpop list1 // 1

# redis-cli 测试数据类型 set(去重)
- 插入个值 sadd set1 10
- 查看长度 scard set1 // 1
- 插入个值 sadd set1 20
- 插入个值 sadd set1 20
- 查看长度 scard set1 // 2, 所以自动去重
- 查看某值 sismember set1 20 // 1, 在
- 删除某值 srem set1 20 
- 查看某值 sismember set1 20 // 0, 不在

# redis-cli 测试数据类型 hash(散列)
- 插入个值 hset hash1 k1 10 
- 查看某值 hget hash1 k1
- 查看长度 hlen hash1
- 插入某值 hset hash1 k3 30
- 查看多个 hmget hash1 k1 k3

# redis-cli 测试数据类型 sort set
- 插入个值 zadd zset1 10 val1
- 插入个值 zadd zset1 30 val3
- 插入个值 zadd zset1 20 val2
- 查看长度 zcard zset1 // 3
- 查看排名 zrange zset1 0 2 // val1 val2 val3
- 查看排名 zrange zset1 0 2 withscores // val1 10 val2 20 val3 30
- 查看排名 zrank zset1 val2 // 2, 排名索引1
- 修改某值 zadd zset1 40 val3
- 查看排名 zrank zset1 0 2 withscores // val1 10 val2 20 val3 40






 
