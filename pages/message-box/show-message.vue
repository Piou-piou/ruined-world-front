<template>
  <div>
    <Nav/>

    <h1>Un message</h1>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import Nav from '~/components/MessageBox/Nav.vue';

  export default {
    mixins: [Utils],
    components: {
      Nav
    },
    data() {
      return {

      };
    },
    methods: {

    },
    mounted() {

    }
  }
</script>