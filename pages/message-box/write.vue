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
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        })
      }
    },
    mounted() {
      if (localStorage.getItem('message_user_id')) {
        this.userId = localStorage.getItem('message_user_id');
        this.pseudo = localStorage.getItem('message_user_pseudo');
        localStorage.removeItem('message_user_id');
        localStorage.removeItem('message_user_pseudo');
      }
    }
  }
</script>