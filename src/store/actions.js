import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utils'

export const selectPlay = function ({commit, state}, {list, index}) {
  if (state.playMode === playMode.random) {
    let song = list[index]
    let _list = shuffle(list)
    let _index = _list.findIndex(item => {
      return item.id === song.id
    })
    commit(types.SET_PLAY_LIST, _list)
    commit(types.SET_CURRENT_INDEX, _index)
  } else {
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
  }
  // commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULLSCREEN, true)
}

export const randomPlay = function ({commit, state}, {list}) {
  commit(types.SET_PLAY_LIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULLSCREEN, true)
}
