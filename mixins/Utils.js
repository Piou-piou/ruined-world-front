const Cookie = process.client ? require('js-cookie') : undefined;
import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';

export default {
  methods: {
    testAndUpdateToken() {
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
      } else {
        this.$router.push('/logout');
      }
    }
  }
};
