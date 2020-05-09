# loader
- 用来处理资源文件
- 可以串联使用，从右到左，右边的先执行
- 可以是同步&异步的
- 可以在nodejs环境下运行
- 可以接收一些参数

# usage
- 可以在require时直接使用
    - `require(loader!./xx/file)`
- config文件里
    - `module -> rules[]`
        - test 正则
        - exclude 正则或者绝对路径(可数组) 譬如/node_modules/
        - include 
        - loader
- CLI命令里

# loaders
|loader|作用|解决现象|
|---|---|---|
|babel|es6 -> es5|不识别es6语法|
||图片压缩||
||图片转base64编码||
|css-loader|识别css模块|解决打包含css模块会报错|
|style-loader|插入html的head头部|解决作用不起效(实际是没自动引入)|
|post-css-loader|加浏览器前缀|-|


# 【js】 babel-loader
- babel官网，看setup，选webpack查看
- 安装 babel-loader, @babel/core, @babel/preset-env
- loader指定为babel-loader
- .babelrc配置presets

# 【样式】 css-loader
- config
    - importLoaders = 1

# 【样式】style-loader
- 向Dom载入style标签
- 串联的最后一步（第一个）
- 注意浏览器中才能看到(js注入)，打包后的html中没有
- config

# 【样式】post-css-loader
- config
- plugins
    - autoprefixer 

# 【样式】less-loader
