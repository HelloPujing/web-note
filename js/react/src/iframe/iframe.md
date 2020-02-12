# attribute

```html
<iframe src="http://xxx" name="frameName" />
```

# api
```html
contentWindow
contentDocument
```

# 发送消息
```javascript
 // 任意源
window.postMessage('msg', '*');
// 传对象，为了浏览器兼容，最好序列化
window.postMessage(JSON.stringify({k: v}), '*');

```
# 父子通信
```javascript
// iframe向父，先拿到父窗口
window.parent.postMessage('msg', '*');
// 父向iframe，先拿到frame的window（要等挂载完）
frame.contentWindow.postMessage('msg', '*');
```

# 消息监听
```javascript
// data parse
// origin 域
// source window代理
window.addEventListener('message', ({data, origin, source}) => {})
```
