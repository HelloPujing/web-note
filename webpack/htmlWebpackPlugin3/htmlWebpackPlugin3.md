# 多页面配置
- 多页面意味着多个html
- plugins里，创建多个htmlWebpackPlugin
- 每个plugin里，chunks数组指定相关模块代码，注意引号
    - `chunks: ['main', 'a']`
    - main即entry里的模块名
- 或者也可以用excludeChunks来排除
    - `excludeChunks: ['b', 'c']`

# 初始化脚本（inline）
- 一些初始化脚本直接注入html，而不是链接形式导入（减少http请求）
