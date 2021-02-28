<template>
  <ball :size="size"></ball>
</template>

<script>
import ball from './src/index.vue'

export default {
  name: 'App',
  data(){
    return {
      size:{
        width:800,
        height:600
      }
    }
  },
  components: {
    ball
  }
}
</script>

<style>
#app {
}
</style>
