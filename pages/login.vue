<template>
  <div id="login">
    <div  v-bind:class="{active: loading}">
      <div  class="loading">
        Chargement...
      </div>
    </div>

    <div v-bind:class="{active: !loading}">
      <form action="" class="login-form">
        <h1>Ruined World</h1>
        <h2>Connexion</h2>

        <div class="block">
          <label for="pseudo">Pseudo</label>
          <input type="text" name="pseudo" id="pseudo" v-model="pseudo">
        </div>
        <div class="block">
          <label for="password">Mot de passe</label>
          <input type="password" name="password" id="password" v-model="password">
        </div>
        <button type="submit" v-on:click.stop.prevent="submit">Connexion</button>
      </form>
    </div>

  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        pseudo: null,
        password: null,
        loading: true
      }
    },
    methods: {
      submit() {
        return this.getApi().post('users/authenticate', {
          'pseudo': this.pseudo,
          'password': this.password
        })
          .then((data) => {
            if (data.success === true) {
              this.setToken(data.token);

              this.$router.push('/');
              return;
            } else {
              this.getFlash().append(data.error_message, 'error');
              return;
            }
          })
          .catch(() => {
            this.getFlash().append('Une erreur est survenue. Merci de réessayer dans un instant', 'error');
            return;
          });
      },
    },
    mounted() {
      const testToken = this.testAndUpdateToken('login');
      if (!testToken) {
        this.loading = false;
      }
    },
    created() {
      this.testUpdateAppVersion();
    }
  }
</script>
