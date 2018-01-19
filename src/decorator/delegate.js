import mix from 'mix-with'
import Delegate from '../mixin/Delegate'

export default function delegate (target) {
  return class DecoratedDelegateClass extends mix(target).with(Delegate) {
    constructor (el, ...params) {
      super(...params)
      this.initDelegate(el, target.prototype.__decorated_callbacks__)
    }
  }
}
