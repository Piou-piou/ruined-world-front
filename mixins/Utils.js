import jwt from 'jsonwebtoken';
import RibsApi from 'ribs-api';
import ribsFlash from 'ribs-flash-message';
import game_infos from '~/assets/game_infos.json';

export default {
  data() {
    return {
      resources: {}
    }
  },
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
     * method to get jwt values
     * @param additionalValues
     * @returns {*|number|PromiseLike<ArrayBuffer>}
     */
    getJwtValues(additionalValues = {}) {
      const values = {
        iat: Math.floor(Date.now() / 1000) - 30,
        token: this.getToken(),
        guid_base: this.getGuidBase(),
      };

      if (Object.keys(additionalValues).length > 0) {
        for (const index in additionalValues) {
          values[index] = additionalValues[index];
        }
      }

      return this.getJwt().sign(values, this.getToken());
    },

    /**
     * method to get Api
     * @returns {RibsApi}
     */
    getApi() {
      if (this.api === undefined) {
        this.api = new RibsApi('https://dev.ruined-world-api.anthony-pilloud.fr/api/', 'cors');
      }

      return this.api;
    },

    /**
     * metho to get flash message
     * @returns {RibsFlashMessage}
     */
    getFlash() {
      if (this.flash === undefined) {
        this.flash = new ribsFlash();
      }

      return this.flash;
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
     * method to update token
     * @param token
     */
    updateTokenIfExist(token) {
      if (token !== '' && token !== undefined) {
        this.setToken(token);
      }
    },

    /**
     * method that return current app version
     * @returns {any}
     */
    getActualVersion() {
      return localStorage.actual_version;
    },

    /**
     * method that define current version
     * @param value
     */
    setActualVersion(value) {
      localStorage.setItem('actual_version', value);
    },

    /**
     * method to test if current version is equal to app_version in config file.
     * if not update app with location.reload
     */
    testUpdateAppVersion() {
      if (process.client) {
        this.getApi().post('version/').then((data) => {
          const appVersion = data.app_version;
          const actualVersion = this.getActualVersion();
          if (appVersion !== actualVersion) {
            this.setActualVersion(appVersion);
            window.location.reload();
          }
        });
      }
    },

    /**
     * method to return current resources of the base
     * @returns {null|any}
     */
    getResources() {
      if (localStorage) {
        this.resources = localStorage.getItem('resources') ? JSON.parse(localStorage.getItem('resources')) : {};
      }
      return this.resources;
    },

    /**
     * method to set resources in localStorage
     * @param resources
     */
    setResources(resources) {
      this.resources = {
        electricity: resources.electricity,
        iron: resources.iron,
        fuel: resources.fuel,
        water: resources.water,
        food: resources.food,
        foodConsumptionHour: resources.food_consumption,
        foodString: resources.food_string,
      };

      if (localStorage) {
        localStorage.setItem('resources', JSON.stringify(this.resources));
      }
    },

    /**
     * method to get unread message number
     * @returns {any}
     */
    getUnreadMessageNumber() {
      if (localStorage) {
        this.unreadMessageNumber = localStorage.getItem('unreadMessageNumber') ? JSON.parse(localStorage.getItem('unreadMessageNumber')) : {};
      }

      return this.unreadMessageNumber;
    },

    /**
     * method to set unread message number
     * @param nbUnread
     */
    setUnreadMessageNumber(nbUnread) {
      this.unreadMessageNumber = nbUnread;

      if (localStorage) {
        localStorage.setItem('unreadMessageNumber', JSON.stringify(this.unreadMessageNumber));
      }
    },

    /**
     * method to get json of game config and vars
     */
    getGameInfos() {
      return game_infos;
    },

    /**
     * method to chane bpody class when open or close popup
     */
    toggleBodyClassForPopup() {
      const body = document.body;
      body.classList.toggle('ribs-popup-body');
    },

    /**
     * method called to refresh resources
     */
    refreshResources() {
      this.getApi().post('refresh-resources/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        this.setInfoPremiumStorage(data.premium_storage);
        this.setResources(data);
      });
    },

    setInfoPremiumStorage(premiumStorage) {
      if (Object.keys(premiumStorage).length > 0) {
        this.premiumStorage = premiumStorage;
      } else {
        this.premiumStorage = {};
      }
    },

    /**
     * method to refresh unread message number
     */
    refreshUnreadMessageNumber() {
      this.getApi().post('message/unread-number/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.setUnreadMessageNumber(data.nb_unread);
        }
      });
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
              context.$router.push('/');
            }

            return true;
          } else {
            context.$router.push('/logout');
          }
        }).catch(function () {
          context.$router.push('/logout');
        });

        return true;
      } else if (process.client && page === null && (localStorage.getItem('token') === null || localStorage.getItem('token') === '')) {
        this.$router.push('/logout');
      } else {
        return false;
      }
    },

    /**
     * method to convert second to hours minute
     * @param time
     * @returns {string}
     */
    secondToHourMinute(time) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor(time % 3600 / 60);
      const seconds = Math.floor(time % 60);

      const hoursDisplay = hours === 0 ? '' : `${hours}h`;
      const minutesDisplay = minutes === 0 ? '' : `${minutes}min`;
      const secondsDisplay = seconds === 0 ? '' : `${seconds}sec`;

      return `${hoursDisplay} ${minutesDisplay} ${secondsDisplay}`;
    }
  }
};
