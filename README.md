# dodele | Web前端事件代理

## 安装

``` shell
npm i dodele --save
```

## 使用

本工具依赖[litchy](https://www.npmjs.com/package/litchy), 示例代码如下:

``` js
import Eventable from 'litchy/lib/Eventable'
import mix from 'litchy/lib/mix'
import Delegate from 'dodele'

class Foobar extends mix(Eventable).with(Delegate) {
  // ...
}
```

## Delegate

Delegate为一个mixin类, 提供了一个`on$`方法, 用来监听DOM事件. 

Delegate主要方法如下:

### on$(eventType, selector, callback)

监听DOM事件.

#### 参数

* eventType {string} 监听事件类型
* selector {string} css选择器
* callback 回调函数

#### 返回值

{Function} 停止监听函数, 调用则停止监听.

### initDelegate(el)

初始化Delegate, 使用前必须调用, 建议在子类构造函数中调用.

#### 参数

* el {Element} 根节点

#### 返回值

无.

### initDecoratedDelegate(el)

初始化通过装饰器添加的Delegate, 使用前必须调用, 建议在子类构造函数中调用. 详情见装饰器@callback.

#### 参数

* el {Element} 根节点

#### 返回值

无.

## 装饰器

dodele提供了两个装饰器方便开发者使用, 分别为:

### @delegate

类装饰器, 给被装饰的类添加DOM事件代理功能.

使用:

``` js
import Eventable from 'litchy/lib/Eventable'
import delegate from 'dodele/lib/decorator/delegate'

@delegate
class Foobar {
  // ...
}
```

注意, 被装饰的类不需要调用`initDelegate`, dodele内部会自动调用.

### @callback(eventType, selector)

方法装饰器, 表示被装饰的成员方法是一个DOM事件回调, eventType和selector分别是要监听的事件类型和css选择器.

使用:

``` js
import Eventable from 'litchy/lib/Eventable'
import delegate from 'dodele/lib/decorator/delegate'
import callback from 'dodele/lib/decorator/callback'

@delegate
class Foobar {
  // 注意, Foobar的构造函数只有一个参数data, 但是经过装饰之后, 第一个参数是el, 第二个参数才是data.
  constructor(data) {
    // ...
  }

  @callback('click', '.foo')
  foo(evt) {
    // ...
  }

  @callback('click', '.bar')
  bar(evt) {
    // ...
  }
}
```

有时由于要mixin多个功能到一个类, 不适合使用@delegate装饰器, 但是又需要使用@callback装饰器, 此时可以使用mix函数类定义类, 同时在子类构造函数中手工调用`initDecoratedDelegate`.

例子:

``` js
import Eventable from 'litchy/lib/Eventable'
import mix from 'litchy/lib/mix'
import XXX from 'XXX'
import Delegate from 'dodele/lib/Delegate'
import callback from 'dodele/lib/decorator/callback'

class Foobar extends mix(Eventable).with(Delegate, XXX) {
  constructor(el, data) {
    this.initDecoratedDelegate(el) // 注意, 此函数必须手工调用
  }

  @callback('click', '.foo')
  foo(evt) {
    // ...
  }

  @callback('click', '.bar')
  bar(evt) {
    // ...
  }
}
```

## 插件

dodele提供了一种插件机制, 方便开发者监听原生DOM事件, 做自定义计算, 并发出自定义事件.

### 插件开发方式

``` js
import Eventable from 'litchy/lib/Eventable'
import delegate from 'dodele/lib/decorator/delegate'
import callback from 'dodele/lib/decorator/callback'

// 插件对象
class FoobarPlugin {
  // 插件必须拥有的属性, 自定义事件种类
  get eventType(this) {
    return 'foobar'
  }

  // 当上层逻辑监听foobar事件时, 此函数会被调用
  recognize() {
    this.off_ = this.on$('click', '*', _ => {
      const e = new Event('foobar', {
        bubbles: true
      })

      // 发出自定义事件
      evt.target.dispatchEvent(e)
    })
  }

  // 当上层逻辑停止监听foobar事件时, 此函数会被调用
  unrecognize() {
    if (this.off_ = ) {
      this.off_()
      this.off_ = null
    }
  }
}

@delegate
class Foobar {
  constructor(data) {
    this.installPlugin(new FoobarPlugin())
  }

  // 监听自定义事件
  @callback('foobar', '*')
  onFoobar(evt) {
    // ...
  }
}
```

注意, recognize和unrecognize的调用都有引用计数, 插件内部不需要再做引用计数.


