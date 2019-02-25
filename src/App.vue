<template>
  <div id="app">
    <m-header></m-header>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'

export default {
  name: 'App',
  components: {
    MHeader
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  #app
    background $color-background
    color $color-theme
</style>
