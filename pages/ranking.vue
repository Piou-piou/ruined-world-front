<template>
  <div>
  
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        players: {}
      }
    },
    methods: {
    
    },
    mounted() {
      this.getApi().post('ranking/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          console.log(data);
        }
      });
    }
  }
</script>