<template>
  <div>
    <Nav/>

    <h1>Ecrire un message</h1>
  
    <form action="">
      <div>
        A : <input type="text" v-model="pseudo">
      </div>
  
      <div>
        Sujet : <input type="text" v-model="subject">
      </div>
  
      <div>
        <textarea v-model="message"></textarea>
      </div>
  
      <div>
        <button v-on:click.stop.prevent="submit">Envoyer</button>
      </div>
  
      <input type="hidden" v-model="userId">
    </form>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import Nav from '~/components/MessageBox/Nav.vue';

  export default {
    mixins: [Utils],
    components: {
      Nav
    },
    data() {
      return {
        pseudo: '',
        userId: null,
        subject: '',
        message: ''
      };
    },
    methods: {
      /**
       * method used tpo submit the form to send a message
       */
      submit() {
        this.getApi().post('message/send/', {
          infos: this.getJwtValues({
            pseudo: this.pseudo,
            user_id: this.userId,
            subject: this.subject,
            message: this.message
          }),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.getFlash().append(data.success_message, 'success');
            this.$router.push('/message-box')
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      },

      /**
       * method to add > beofe all old messages
       */
      parseMessage() {
        let message = this.message;
        message = message.split('\n');

        for (const i in message) {
          message[i] = '> ' + message[i] + '\n';
        }

        this.message = '\n\n' + message.join('');
      }
    },
    mounted() {
      if (localStorage.getItem('message_user_id')) {
        this.userId = localStorage.getItem('message_user_id');
        this.pseudo = localStorage.getItem('message_user_pseudo');
        localStorage.removeItem('message_user_id');
        localStorage.removeItem('message_user_pseudo');
      }

      if (localStorage.getItem('message')) {
        this.getApi().post('message/show/', {
          infos: this.getJwtValues({message_id: localStorage.getItem('message')}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && Object.keys(data.message).length > 0) {
            this.message = data.message.message.message;
            this.userId = data.message.message.user.id;
            this.pseudo = data.message.message.user.pseudo;
            this.parseMessage();
          }
        });
      }
    }
  }
</script>