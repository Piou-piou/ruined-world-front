<template>
  <form action="">
    <label for="pseudo">Pseudo</label>
    <input type="text" name="pseudo">
    <label for="password">Mot de passe</label>
    <input type="password" name="password">
  </form>
</template>

<script>
  const Cookie = process.client ? require('js-cookie') : undefined;
  import jwt from 'jsonwebtoken';
  import FormData from 'form-data';
  import fetch from 'node-fetch';
  import RibsApi from 'ribs-api';

  export default {
    middleware: 'notAuthenticated',
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
          context.router.push('/logout');
        });
      }
    }
  }
</script>
