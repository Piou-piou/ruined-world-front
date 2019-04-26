import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';

export default {
  methods: {
    /**
     * method to get user auth token
     * @returns {any}
     */
    getToken() {
      return localStorage.token;
    },

    /**
     * method to set user auth token
     * @param value
     */
    setToken(value) {
      localStorage.setItem('token', value);
    },

    /**
     * method to test if token of user is always valid
     * @param page
     * @returns {boolean}
     */
    testAndUpdateToken(page = null) {
      if (process.client && localStorage.getItem('token') !== null && localStorage.getItem('token') !== '') {
        const api = new RibsApi('http://dev.ruined-world-api.anthony-pilloud.fr/api/', 'cors');

        const jwtInfos = jwt.sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30
        }, this.getToken());

        const context = this;

        api.post('users/test-token', {'infos': jwtInfos, 'token': this.getToken()}).then((data) => {
          if (data.success === true) {
            this.setToken(data.token);

            if (page === 'login') {
              context.router.push('/');
            }

            return true;
          } else {
            context.router.push('/logout');
          }
        }).catch(function () {
          context.$router.push('/logout');
        });

        return true;
      } else if (process.client && page === null && (localStorage.getItem('token') === null || localStorage.getItem('token') === '')) {
        this.$router.push('/logout');
      }
    }
  }
};
