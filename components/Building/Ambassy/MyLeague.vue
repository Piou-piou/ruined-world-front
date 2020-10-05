<template>
  <div>
    <h1>League</h1>

  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        base: this.$parent.base
      }
    },
    methods: {
    },
    mounted() {
      this.getApi().post('embassy/show/', {
        'infos': this.getJwtValues(),
        'token': this.getToken(),
      }).then(data => {
        if (data.success) {
          console.log(data);
        }
      });
    }
  }
</script>