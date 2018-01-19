
export default function callback (type, selector) {
  return function decorator (target, key, descriptor) {
    if (descriptor.get || descriptor.set) {
      throw new TypeError(`Property ${key} should NOT be decorated by @callback.`)
    }

    const fn = descriptor.value
    const callbacks = target.__decorated_callbacks__ = target.__decorated_callbacks__ || []

    callbacks.push({
      type, selector, callback: fn
    })

    return descriptor
  }
}
