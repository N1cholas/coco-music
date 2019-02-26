import { jsonp } from 'common/js/jsonp'

const data = {
  g_tk: 5381,
  uin: 0,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'h5',
  needNewCode: 1
}

export function getSlider () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  return jsonp(url, data, {
    param: 'jsonpCallback'
  })
}
