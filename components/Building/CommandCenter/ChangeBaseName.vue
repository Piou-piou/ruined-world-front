<template>
  <div>
    <h3>Changer le nom de votre base</h3>
    <p>Ici vous pouvez changer le nom de votre base.</p>

    <form action="">
      <input type="text" v-model="base_name" name="base_name">
      <button  v-on:click.stop.prevent="submit">Changer</button>
    </form>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        base_name: this.$parent.building.base.name,
      }
    },
    methods: {
      submit() {
        this.getApi().post('base/change-name/', {
          'infos': this.getJwtValues({base_name: this.base_name}),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true) {
            this.base_name = data.base_name;
            this.getFlash().append(data.success_message, 'success');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      }
    }
  }
</script>