<template>
  <div>
    <h1 v-if="new_construction === true">Nouveau bâtiment</h1>
    <h1 v-else>Bâtiment déjà construit</h1>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    data() {
      return {
        new_construction: false
      }
    },
    mounted() {
      //not work for the moment
      /*if (localStorage.building_array_name !== null) {
        this.new_construction = false;
      }*/
    },
  }
</script>