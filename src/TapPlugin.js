/**
 * Tap插件
 *
 * @author Y3G
 */

/* global Event */

export default class TapPlugin {
  get eventType () {
    return 'tap'
  }

  get delegate () {
    return this.delegate_
  }

  get selector () {
    return this.selector_
  }

  constructor (delegate, selector) {
    this.delegate_ = delegate
    this.selector_ = selector
    this.offs_ = []
    this.tapEvtStart = 0
  }

  recognize () {
    const { selector, delegate } = this
    this.offs_.push(delegate.on$('mousedown', selector, this.onMouseDown.bind(this)))
    this.offs_.push(delegate.on$('mouseup', selector, this.onMouseUp.bind(this)))
    this.offs_.push(delegate.on$('touchstart', selector, this.onTouchStart.bind(this)))
    this.offs_.push(delegate.on$('touchend', selector, this.onTouchEnd.bind(this)))
  }

  unrecognize (that) {
    this.offs_.forEach(fn => fn(that))
    this.offs_ = []
  }

  onMouseDown (evt) {
    this.tapEvtStart = new Date().getTime()
  }

  onMouseUp (evt) {
    this.cb(evt.target)
    evt.preventDefault()
  }

  onTouchStart (evt) {
    this.tapEvtStart = new Date().getTime()
  }

  onTouchEnd (evt) {
    this.cb(evt.target)
    evt.preventDefault()
  }

  cb (target) {
    if (new Date().getTime() - this.tapEvtStart > 300) return
    const newEvt = new Event('tap', {
      bubbles: true
    })
    target.dispatchEvent(newEvt)
  }
}
