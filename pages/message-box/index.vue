<template>
  <div class="messages">
    <Nav/>
    
    <h1>Messagerie</h1>
    
    <div v-if="messages.length > 0">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Recu le</th>
            <th>Lu</th>
            <th>De</th>
            <th>Sujet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(message, key) in messages" :key="key" @click="showMessage(message.id)">
            <td><input type="checkbox"></td>
            <td>{{message.message.formattedSendAt}}</td>
            <td>
              <span v-if="message.readAt">oui</span>
              <span v-else>non</span>
            </td>
            <td>{{message.message.user.pseudo}}</td>
            <td>{{message.message.subject}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Aucun message</div>
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
        messages: {}
      };
    },
    methods: {
      /**
       * method to go on page to show a message
       * @param id
       */
      showMessage(id) {
        localStorage.setItem('message', id);
        this.$router.push('/message-box/show-message');
      }
    },
    mounted() {
      this.getApi().post('message/list/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then(data => {
        this.updateTokenIfExist(data.token);
        const messages = JSON.parse(data.messages);
        if (data.success === true && messages.length > 0) {
          this.messages = messages;
        }
      });
    }
  }
</script>