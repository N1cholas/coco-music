import RawJSONP from 'jsonp'

export function jsonp (url, data, options) {
  url += url.indexOf('?') < 0 ? '?' : '&'
  url += param(data)

  return new Promise((resolve, reject) => {
    RawJSONP(url, options, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

export function param (data) {
  let url = ''

  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key] !== undefined ? data[key] : ''
      url += `&${key}=${encodeURIComponent(value)}`
    }
  }

  return url ? url.substring(1) : ''
}
