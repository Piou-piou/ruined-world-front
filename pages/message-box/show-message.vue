<template>
  <div>
    <Nav/>

    <div>
      <h1>{{message.subject}}</h1>
      <div>
        {{message.message}}
      </div>
    </div>

     <div>
       <button>Répondre</button>
       <button @click="deleteMessage">Supprimer</button>
       <nuxt-link to="/message-box"><button>Retour</button></nuxt-link>
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
        message: {}
      };
    },
    methods: {
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
          if (data.success === true && data.message.length > 0) {
            this.message = JSON.parse(data.message).message;
          }
        });
      } else {
        this.$router.push('/message-box');
      }
    }
  }
</script>