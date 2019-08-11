<template>
  <div id="login">
    <div  v-bind:class="{active: loading}">
      <div  class="loading">
        Chargement...
      </div>
    </div>

    <div v-bind:class="{active: !loading}" id="login-form">
      <form action="">
        <h1>Ruined World</h1>
        <h2>Connexion</h2>

        <div class="block">
          <label>Pseudo</label>
          <input type="text" name="pseudo" v-model="pseudo">
        </div>
        <div class="block">
          <label>Mot de passe</label>
          <input type="password" name="password" v-model="password">
        </div>
        <button type="submit" v-on:click.stop.prevent="submit">Connexion</button>
      </form>
      <a href="" v-on:click.stop.prevent="changeForm">Tu n'as pas encore de compte ? Inscris toi !</a>
    </div>

    <div id="registration-form">
      <form action="">
        <h1>Ruined World</h1>
        <h2>Inscription</h2>

        <div class="block">
          <label>Pseudo</label>
          <input type="text" name="pseudo-registration" v-model="pseudoRegistration" @keyup="checkPseudo" v-bind:class="{'error': pseudoError.length > 0, 'valid': pseudoSuccess === true}"  autocomplete="none">
          <p class="error">{{pseudoError}}</p>
        </div>
        <div class="block">
          <label>E-mail</label>
          <input type="email" name="mail" v-model="mail" v-bind:class="{'error': mailError.length > 0, 'valid': mailSuccess === true}" @keyup="checkMail" autocomplete="none">
          <p class="error">{{mailError}}</p>
        </div>
        <div class="block">
          <label>Mot de passe</label>
          <input type="password" name="password" v-model="password"  v-bind:class="{'error': passwordError.length > 0, 'valid': passwordSuccess === true}" @keyup="checkPassword">
          <p class="error">{{passwordError}}</p>
        </div>
        <div class="block">
          <label>Vérifies ton Mot de passe</label>
          <input type="password" name="verify-password" v-model="verifyPassword"  v-bind:class="{'error': verifyPasswordError.length > 0, 'valid': verifyPasswordSuccess}" @keyup="verifyPasswordMatch">
          <p class="error">{{verifyPasswordError}}</p>
        </div>
        <button type="submit" v-on:click.stop.prevent="submitSignup">Inscription</button>
      </form>
      <a href="" v-on:click.stop.prevent="changeForm">Retour</a>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import RibsCore from 'ribs-core';

  export default {
    mixins: [Utils],
    data() {
      return {
        pseudo: null,
        pseudoRegistration: '',
        mail: null,
        password: null,
        verifyPassword: null,
        loading: true,
        pseudoKeyTimeout: 0,
        pseudoSuccess: false,
        pseudoError: '',
        mailSuccess: false,
        mailError: '',
        passwordSuccess: false,
        passwordError: '',
        verifyPasswordSuccess: false,
        verifyPasswordError: ''
      }
    },
    methods: {
      /**
       * method to submit login form
       * @returns {Q.Promise<unknown>}
       */
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

      /**
       * method used to change between login and registration form
       */
      changeForm() {
        const loginForm = document.getElementById('login-form');
        const registrationForm = document.getElementById('registration-form');

        loginForm.classList.toggle('active');
        registrationForm.classList.toggle('active');
      },

      /**
       * method called on keyup in pseudo to test it
       */
      checkPseudo() {
        clearTimeout(this.pseudoKeyTimeout);

        this.pseudoKeyTimeout = setTimeout(() => {
          if (this.pseudoRegistration.length < 4) {
            this.pseudoError = 'Ton pseudo doit faire plus de 4 caractères';
          } else {
            return this.getApi().post('signup/check-pseudo-used/', {
              'pseudo': this.pseudoRegistration
            }).then(data => {
              if (data.success === true && data.error_message.length > 0) {
                this.pseudoError = data.error_message;
              } else {
                this.pseudoError = '';
                this.pseudoSuccess = true;
              }
            });
          }
        }, 500);
      },

      /**
       * method to verify mail address
       */
      checkMail() {
        clearTimeout(this.mailTimeout);

        this.mailTimeout = setTimeout(() => {
          if (!RibsCore.validateMail(this.mail)) {
            this.mailError = 'Ton adresse email n\' est pas valide';
          } else {
            return this.getApi().post('signup/check-mail-used/', {
              'mail': this.mail
            }).then(data => {
              if (data.success === true && data.error_message.length > 0) {
                this.mailError = data.error_message;
              } else {
                this.mailError = '';
                this.mailSuccess = true;
              }
            });
          }
        }, 500);
      },

      /**
       * method to check password
       */
      checkPassword() {
        clearTimeout(this.passwordTimeout);

        this.passwordTimeout = setTimeout(() => {
          if (!RibsCore.testPasswordStrength(this.password, 4, 6)) {
            this.passwordError = 'Ton mot de passe doit contenir au moins 6 caractères, une majuscule, un chiffre et un caractère sépcial';
          } else {
            this.passwordError = '';
            this.passwordSuccess = true;
          }
        }, 500);
      },

      /**
       * method to verify if passwords match
       */
      verifyPasswordMatch() {
        clearTimeout(this.passwordVerifyTimeout);

        this.passwordVerifyTimeout = setTimeout(() => {
          if (this.password !== this.verifyPassword) {
            this.verifyPasswordError = 'Les mots de passe ne correspondent pas';
          } else {
            this.verifyPasswordError = '';
            this.verifyPasswordSuccess = true;
          }
        }, 500);
      },

      /**
       * method to submit register form
       * @returns {Q.Promise<unknown>}
       */
      submitSignup() {
        return this.getApi().post('signup/register/', {
          'pseudo': this.pseudoRegistration,
          'mail': this.mail,
          'password': this.password
        })
          .then((data) => {
            if (data.success === true) {
              this.getFlash().append(data.success_message, 'success');
              this.changeForm();
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
