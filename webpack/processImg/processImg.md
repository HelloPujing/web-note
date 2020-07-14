# 图片类型
- css里很多背景图
- 模板里直接引用图片（img标签）
- 根部html文件（icon？）

# loader
- `file-loader`
    - 识别图片格式文件
    - 配置：打包后资源路径及文件设定， options: {name: `img/[name]-[hash:5].[ext]`}
- `url-loader`
    - 和file-loader很像
    - 多了一个配置，limit，小于limit大小的图片会被转为base64，但是同时会增加js/html大小，且无法利用浏览器图片缓存

