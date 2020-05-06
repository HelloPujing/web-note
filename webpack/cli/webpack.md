# webpack
- 特性：代码分割split，只加载需要的文件
- loader: 加载各种各样的文件

# install
- npm init
- npm install -D webpack

# 一下为命令行

# 打包一个js文件
- (默认支持js)
- hello.js
- world.js 
- hello.js里require world进来
- npx webpack hello.js --mode development

# 打包一个css文件
- (默认不支持css)
- style.css
- hello.js里require css进来
- npx webpack hello.js --mode development
- 报错，需要loader
- npm install css-loader、 style-loader
- `require('style-loader!css-loader!./style.css')`

# 引入html查看效果
- html里script引入bundle.js

# 避免每个样式文件都要loader前缀
- 在打包命令上处理
- --module-bind 'xx=xxloader'
- npx webpack src/hello.js --mode development --module-bind 'css=style-loader!css-loader'

# 避免每次手动打包（文件变更自动打包）
- --watch
- npx webpack src/hello.js --watch --mode development --module-bind 'css=style-loader!css-loader'

# 其他参数
- --progress 能看到打包过程、进度
- --display-modules

