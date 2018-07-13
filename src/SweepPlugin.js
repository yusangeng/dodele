/**
 * Sweep插件
 *
 * @author Y3G
 */

/* global Event */
const moveDistanse = 200

export default class SweepPlugin {
  get eventType () {
    return 'sweep'
  }

  get delegate () {
    return this.delegate_
  }

  get selector () {
    return this.selector_
  }

  get status () {
    return this.status_
  }

  constructor (delegate, selector) {
    this.delegate_ = delegate
    this.selector_ = selector
    this.offs_ = []
    this.status_ = {}
  }

  recognize () {
    const { selector, delegate } = this
    this.offs_.push(delegate.on$('mousedown', selector, this.onMouseDown.bind(this)))
    this.offs_.push(delegate.on$('mousemove', selector, this.onMouseMove.bind(this)))
    this.offs_.push(delegate.on$('mouseup', selector, this.onMouseUp.bind(this)))
    this.offs_.push(delegate.on$('touchstart', selector, this.onTouchStart.bind(this)))
    this.offs_.push(delegate.on$('touchmove', selector, this.onTouchMove.bind(this)))
    this.offs_.push(delegate.on$('touchend', selector, this.onTouchEnd.bind(this)))
    this.offs_.push(delegate.on$('touchcancel', selector, this.onTouchCancel.bind(this)))

    this.status.panning = false
    this.status.target = null
  }

  unrecognize (that) {
    this.status.panning = false
    this.status.target = null
    this.offs_.forEach(fn => fn(that))
    this.offs_ = []
  }

  onMouseDown (evt) {
    this.start(evt, evt.target)
  }

  onMouseMove (evt) {
    if (!this.status.panning) {
      return
    }

    const { target } = evt

    if (target !== this.status.target) {
      return
    }

    this.move(evt, target)
    evt.preventDefault()
  }

  onMouseUp (evt) {
    this.stop()
    evt.preventDefault()
  }

  onTouchStart (evt) {
    const { target, touches } = evt

    if (touches.length !== 1) {
      this.stop()
      return
    }

    this.start(touches[0], target)
  }

  onTouchMove (evt) {
    if (!this.status.panning) {
      return
    }

    const { target, touches } = evt

    if (target !== this.status.target) {
      return
    }

    this.move(touches[0], target)
    evt.preventDefault()
  }

  onTouchEnd (evt) {
    this.stop()
    evt.preventDefault()
  }

  onTouchCancel (evt) {
    this.stop()
    evt.preventDefault()
  }

  start (pos, target) {
    this.status.panning = true
    this.status.x = pos.clientX
    this.status.y = pos.clientY
    this.status.target = target
  }

  stop () {
    this.status.panning = false
    this.status.target = null
  }

  move (pos, target) {
    if (!this.status.panning) {
      return
    }

    let newEvt = null
    const deltaX = pos.clientX - this.status.x
    const deltaY = pos.clientY - this.status.y

    if (deltaX > moveDistanse) {
      newEvt = new Event('sweep', {
        bubbles: true
      })

      newEvt.deltaX = deltaX
      newEvt.deltaY = deltaY
      newEvt.orient = 'right'
    }

    // 向左滑出
    if (deltaX < -moveDistanse) {
      newEvt = new Event('sweep', {
        bubbles: true
      })

      newEvt.deltaX = deltaX
      newEvt.deltaY = deltaY
      newEvt.orient = 'left'
    }

    // 向上滑出
    if (deltaY < -moveDistanse) {
      newEvt = new Event('sweep', {
        bubbles: true
      })

      newEvt.deltaX = deltaX
      newEvt.deltaY = deltaY
      newEvt.orient = 'up'
    }

    // 向下滑出
    if (deltaY > moveDistanse) {
      newEvt = new Event('sweep', {
        bubbles: true
      })

      newEvt.deltaX = deltaX
      newEvt.deltaY = deltaY
      newEvt.orient = 'down'
    }

    if (newEvt) {
      target.dispatchEvent(newEvt)
      this.stop()
    }
  }
}
