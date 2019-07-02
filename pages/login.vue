<template>
  <div id="login">
    <form action="" class="login-form active">
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

      <div v-html="htmlError">

      </div>
    </form>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        htmlError: '',
        pseudo: null,
        password: null
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

              this.htmlError = '';

              this.$router.push('/');
              return;
            } else {
              this.htmlError = data.message;
              return;
            }
          })
          .catch(() => {
            this.htmlError = 'Une erreur est survenue. Merci de réessayer dans un instant';
            return;
          });
      },
    },
    mounted() {
      this.testAndUpdateToken('login');
    }
  }
</script>
