/**
 * 事件代理
 *
 * @author Y3G
 */

const { keys } = Object
const capture = type => !['scroll', 'focus', 'blur'].includes(type)
const isSpecial = str => str.startsWith('@')
const isId = str => str.startsWith('#') && !(/[ >,]/).test(str)
const isClass = str => str.startsWith('.') && !(/[ >,]/).test(str)

function createFilter (sel) {
  if (typeof sel === 'function') {
    return sel
  } else if (!sel || !sel.length) {
    return _ => true
  } else if (isClass(sel)) {
    const cls = sel.substring(1)
    return evt => evt.event.target.classList.contains(cls)
  } else if (isSpecial(sel)) {
    const [name, callbackName] = sel.split(':').map(el => el.trim())
    return evt => evt.event.target.getAttribute(name) === callbackName
  } else if (isId(sel)) {
    const id = sel.substring(1)
    return evt => evt.event.target.id === id
  } else {
    return evt => evt.event.target.matches(sel)
  }
}

export default superclass => class extends superclass {
  get el () {
    return this.el_
  }

  constructor (...params) {
    super(...params)
    this.cb_ = event => this.trigger({ type: `dom:${event.type}`, event }, true)
    this.counter_ = {}
  }

  dispose () {
    const { el, cb_: cb, counter_: counter } = this
    const detach = type => el.removeEventListener(type, cb, capture(type))

    keys(counter).forEach(type => counter[type] && detach(type))
    this.el_ = this.cb_ = this.counter_ = null

    super.dispose()
  }

  initDelegate (el) {
    this.el_ = el
  }

  on$ (type, selector, callback) {
    const filter = createFilter(selector)
    const off = this.recognize(type).on(`dom:${type}`, e => filter(e) && callback(e.event))
    return _ => off().unrecognize(type)
  }

  recognize (type) {
    const n = this.counter_[type]
    if (!n) {
      this.el_.addEventListener(type, this.cb_, capture(type))
    }

    this.counter_[type] = (n || 0) + 1
    return this
  }

  unrecognize (type) {
    const n = this.counter_[type]
    if (n === 1) {
      this.el_.removeEventListener(type, this.cb_, capture(type))
    }

    this.counter_[type] = n ? n - 1 : 0
    return this
  }
}
