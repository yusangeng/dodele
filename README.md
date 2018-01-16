# dodele | Web前端事件代理

## 安装

``` shell
npm i dodele --save
```

## 使用

本工具依赖[litchy](https://www.npmjs.com/package/litchy), 示例代码如下:

``` js
import eventable from 'litchy/lib/eventable'
import mix from 'litchy/mix'
import Delegate from 'dodele'

@eventable
class Foobar extends mix(Eventable).with(Delegate) {
  // ...
}
```

## Delegate

Delegate为一个mixin类, 提供了一个`on$`方法, 用来监听DOM事件. 方法如下:

### on$(eventType, selector, callback)

#### 参数

* eventType {string} 监听事件类型
* selector {string} css选择器
* callback 回调函数

#### 返回值

{Function} 停止监听函数, 调用则停止监听.

