<template>
  <div id="app">
    <HeaderCompo/>
    <MiddleCompo/>
    <FooterCompo/>
  </div>
</template>

<script>
import FooterCompo from './components/FooterCompo.vue';
import HeaderCompo from './components/HeaderCompo.vue';
import MiddleCompo from './components/MiddleCompo.vue';



export default {
  name: 'App',
  components: {
    HeaderCompo,
    MiddleCompo,
    FooterCompo
  }
}
</script>

<style>
  @import 'assets/base.css';
</style>
