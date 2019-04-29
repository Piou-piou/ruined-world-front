import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';

export default {
  methods: {
    /**
     * method to get guid of current base
     * @returns {null|any}
     */
    getGuidBase() {
      if (localStorage.guid_base === undefined) {
        return null;
      }

      return localStorage.guid_base;
    },

    /**
     * defined guid of the current base
     * @param guid
     */
    setGuidBase(guid) {
      localStorage.guid_base = guid;
    },

    /**
     * method to get jwt
     * @returns {{JsonWebTokenError, TokenExpiredError, sign, verify, decode, NotBeforeError}|*}
     */
    getJwt() {
      if (this.jwt === undefined) {
        this.jwt = jwt;
      }

      return this.jwt;
    },

    /**
     * method to get Api
     * @returns {RibsApi}
     */
    getApi() {
      if (this.api === undefined) {
        this.api = new RibsApi('http://dev.ruined-world-api.anthony-pilloud.fr/api/', 'cors');
      }

      return this.api;
    },

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
        const jwtInfos = jwt.sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30
        }, this.getToken());

        const context = this;

        this.getApi().post('users/test-token', {'infos': jwtInfos, 'token': this.getToken()}).then((data) => {
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
