<template>
  <form action="">
    <label for="pseudo">Pseudo</label>
    <input type="text" name="pseudo" id="pseudo" v-model="pseudo">
    <label for="password">Mot de passe</label>
    <input type="password" name="password" id="password" v-model="password">
    <button type="submit" v-on:click.stop.prevent="submit">Connexion</button>

    <div v-html="htmlError">

    </div>
  </form>
</template>

<script>
  const Cookie = process.client ? require('js-cookie') : undefined;
  import jwt from 'jsonwebtoken';
  import FormData from 'form-data';
  import RibsApi from 'ribs-api';

  export default {
    middleware: 'notAuthenticated',
    data() {
      return {
        htmlError: '',
        pseudo: null,
        password: null
      }
    },
    methods: {
      submit() {
        let formData;
        formData = new FormData();
        const api = new RibsApi('http://dev.ruined-world-api.anthony-pilloud.fr/api/', 'cors');

        formData.append('pseudo', this.pseudo);
        formData.append('password', this.password);

        return api.post('users/authenticate', formData)
          .then((data) => {
            if (data.success === true) {
              this.$store.commit('setAuth', data.token);
              Cookie.set('token', data.token);
              localStorage.setItem('token', data.token);

              this.htmlError = '';

              this.$router.push('/');
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
    created() {
      if (process.client && localStorage.getItem('token') !== null && localStorage.getItem('token') !== '') {
        this.$store.commit('setAuth', localStorage.getItem('token'));
        Cookie.set('token', localStorage.getItem('token'));

        const api = new RibsApi('http://dev.ruined-world-api.anthony-pilloud.fr/api/', 'cors');

        const jwtInfos = jwt.sign({
          token: this.$store.state.token,
          iat: Math.floor(Date.now() / 1000) - 30
        }, this.$store.state.token);

        const context = this;

        api.post('users/test-token', {'infos': jwtInfos, 'token': this.$store.state.token}).then((data) => {
          if (data.success === true) {
            this.$store.commit('setAuth', localStorage.getItem('token'));
            Cookie.set('token', localStorage.getItem('token'));

            context.$router.push('/');
          } else {
            context.router.push('/logout');
          }
        }).catch(function() {
          context.$router.push('/logout');
        });
      }
    }
  }
</script>
