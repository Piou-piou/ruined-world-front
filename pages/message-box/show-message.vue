<template>
  <div>
    <Nav/>

    <div>
      <h1>{{message.subject}}</h1>
      <div v-html="message.message">
      </div>
    </div>

     <div>
       <button v-if="messageType === 'received'">Répondre</button>
       <button @click="deleteMessage">Supprimer</button>
       <button @click="goBack">Retour</button>
     </div>
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
        message: {},
        messageType: null
      };
    },
    methods: {
      goBack() {
        this.$router.back()
      },

      /**
       * method to delete the current message, on success redirect on index of mesasge box
       */
      deleteMessage() {
        this.getApi().post('message/delete/', {
          infos: this.getJwtValues({message_id: localStorage.getItem('message')}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.getFlash().append(data.success_message, 'success');
            this.$router.push('/message-box');
          } else {
            this.getFlash().append(data.error_message, 'error')
          }
        });
      }
    },
    mounted() {
      if (localStorage.getItem('message') && localStorage.getItem('message') !== '' && localStorage.getItem('message') !== undefined) {
        this.getApi().post('message/show/', {
          infos: this.getJwtValues({message_id: localStorage.getItem('message')}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && Object.keys(data.message).length > 0) {
            this.messageType = data.message.stringMessageType;
            this.message = data.message.message;
          }
        });
      } else {
        this.$router.push('/message-box');
      }
    }
  }
</script>