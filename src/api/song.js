import { commonParams } from './config'
import axios from 'axios'
import { jsonp } from 'common/js/jsonp'

export function getLyric (mid) {
  const url = '/getSongLyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return res
  })
}

export function getSongVkey (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    callback: 'musicJsonCallback',
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    guid: 5384964800,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })

  return jsonp(url, data, {
    params: 'musicJsonCallback'
  })
}
