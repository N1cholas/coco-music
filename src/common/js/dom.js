export function hasClass (el, className) {
  let reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
  return reg.test(el.className)
}

export function addClass (el, className) {
  if (hasClass(el, className)) return
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData (el, key, val) {
  const prefix = 'data-'
  key = prefix + key
  if (val) {
    el.setAttribute(key, val)
  } else {
    return el.getAttribute(key)
  }
}

let vendor = (function () {
  let style = document.createElement('div').style

  let transform = {
    webkit: 'webkitTransform',
    ms: 'msTransform',
    O: 'OTransform',
    Moz: 'MozTransform',
    standard: 'transfrom'
  }

  for (let key in transform) {
    if (style[transform[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle (style) {
  if (!vendor) return

  if (vendor === 'standard') return style

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
