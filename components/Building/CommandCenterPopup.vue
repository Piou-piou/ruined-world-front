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
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('/base/change-name/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          if (data.success === true) {
            this.base_name = data.base_name;
            this.getFlash().append('Le nom de votre base a été modifié.', 'success');
          } else {
            this.getFlash().append('Une erreur est survenue, merci de réessayer', 'error');
          }
        });
      }
    }
  }
</script>