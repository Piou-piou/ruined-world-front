const Cookie = process.client ? require('js-cookie') : undefined;
import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';

export default {
  methods: {
    testAndUpdateToken(page = null) {
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
            localStorage.setItem('token', data.token);
            /*Cookie.set('token', data.token);
            context.$store.commit('setAuth', data.token);*/

            return true;
          } else {
            context.router.push('/logout');
          }
        }).catch(function () {
          context.$router.push('/logout');
        });

        return true;
      } else if (process.client && localStorage.getItem('token') === null && localStorage.getItem('token') === '' && page === null) {
        this.$router.push('/logout');
      }
    }
  }
};
