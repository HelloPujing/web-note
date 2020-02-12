# Lerna 库管理工具疑问以及部分解决方案
https://shimo.im/docs/kWvvQrwHXYQp6qJk

```
// independent 模式
"version": "independent"
```

# lenra包含2种版本号管理机制
- fixed模式下，模块发布新版本时，都会升级到leran.json里编写的version字段
- independent模式下，模块发布新版本时，会逐个询问需要升级的版本号，基准版本为它自身的package.json。
- 2种版本号管理机制均不能解决早会描述版本自行变更问题，确认存在发包版本问题。
