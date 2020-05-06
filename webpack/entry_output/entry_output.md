# entry

> MPA会存在多entry

- 字符串 
```
./src/hello
```
- 数组
```
['./src/hello', './src/world']
```
- 对象
```
{
    hello: './src/hello.js',
    world: './src/world.js'
}
```

# output
- path绝对路径
- filename仅名字，可带相对路径，如果要打包多个用如下占位符
    - `[name]`：包名
    - `[hash]`：本次打包的hash, 各个包一样
    - `[chunkhash]`: 针对对应包的hash,包内容不变就不变

