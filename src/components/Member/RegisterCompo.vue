<template>
  <div>회원가입 페이지</div>
</template>

<script>
import { useStore } from 'vuex';
import {  computed } from 'vue';
export default {
    setup(){
        const store = useStore();
        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        console.log(store.state)
        console.log(isAuthenticated.value)
        
    }

}
</script>

<style>

</style>