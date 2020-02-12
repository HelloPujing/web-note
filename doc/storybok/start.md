# 装包 Packages
dev包：
- @storybook/react
    - 包说明：核心模块
    - 含方法：
        - storiesOf
- @storybook/addon-info
    - 包说明：插件
    - 含方法：
        - withInfo({ }) 配置
            - inline: true 同页显示

# 脚本 npm scripts
storybook有单独的服务器，可以添加nom scripts命令脚本，方便启动
- scripts:
    - "storybook": "start-storybook -p 9001 -c .storybook"
    - -p 表示端口
    - -c 表示配置文件
- 启动：
    - yarn stories


# 配置文件 config.js
- .storybook文件夹
    - config.js
        - 告诉storybook你的stories的存放位置 

# 创建 stories
- xxx.stories.js
    - storiesOf('目录名', module)
        - .add('组件菜单名', ()=>(<Button/>))
