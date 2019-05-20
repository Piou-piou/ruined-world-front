<template>
  <div>
    <p @click="alertMe">test</p>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    data() {
      return {
        new_construction: true
      }
    },
    methods: {
      alertMe() {
        alert('test');
      }
    },
    mounted() {
      //not work for the moment
      if (localStorage.building_array_name !== null) {
        console.log('test');
        this.new_construction = false;
      }
    },
  }
</script>