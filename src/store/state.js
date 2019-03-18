import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: 0,
  playMode: playMode.sequence,
  disc: null,
  listShow: false
}

export default state
