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
          <input type="text" name="pseudo-registration" v-model="pseudoRegistration" @keyup="checkPseudo" v-bind:class="{'error': pseudoError.length > 0}">
          <p class="error">{{pseudoError}}</p>
        </div>
        <div class="block">
          <label>E-mail</label>
          <input type="email" name="mail" v-model="mail" v-bind:class="{'error': mailError.length > 0}">
          <p class="error">{{mailError}}</p>
        </div>
        <div class="block">
          <label>Mot de passe</label>
          <input type="password" name="password" v-model="password"  v-bind:class="{'error': passwordError.length > 0}">
          <p class="error">{{passwordError}}</p>
        </div>
        <div class="block">
          <label>Vérifies ton Mot de passe</label>
          <input type="password" name="verify-password" v-model="verifyPassword"  v-bind:class="{'error': verifyPasswordError.length > 0}">
          <p class="error">{{verifyPasswordError}}</p>
        </div>
        <button type="submit" v-on:click.stop.prevent="submit">Inscription</button>
      </form>
      <a href="" v-on:click.stop.prevent="changeForm">Retour</a>
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
        pseudoRegistration: '',
        mail: null,
        password: null,
        verifyPassword: null,
        loading: true,
        pseudoKeyTimeout: 0,
        pseudoError: '',
        mailError: '',
        passwordError: '',
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
              }
            });
          }
        }, 500);
      }
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
