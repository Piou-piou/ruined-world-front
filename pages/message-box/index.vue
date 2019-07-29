<template>
  <div class="messages">
    <Nav/>
    
    <h1>Messagerie</h1>
    
    <div v-if="messages.length > 0">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" id="check-all"></th>
            <th>Recu le</th>
            <th>Lu</th>
            <th>De</th>
            <th>Sujet</th>
          </tr>
        </thead>
        <tbody id="messages-list">
          <tr v-for="(message, key) in messages" :key="key">
            <td><input type="checkbox" :value="message.id"></td>
            <td  @click="showMessage(message.id)">{{message.message.formattedSendAt}}</td>
            <td  @click="showMessage(message.id)">
              <span v-if="message.readAt">oui</span>
              <span v-else>non</span>
            </td>
            <td  @click="showMessage(message.id)">{{message.message.user.pseudo}}</td>
            <td  @click="showMessage(message.id)">{{message.message.subject}}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <button @click="deleteMessages">Supprimer</button>
      </div>
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
       * method to get all messages of the box
       */
      getAllMessages() {
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
      },

      /**
       * method to go on page to show a message
       * @param id
       */
      showMessage(id) {
        localStorage.setItem('message', id);
        this.$router.push('/message-box/show-message');
      },

      /**
       * method to delete checked messages
       * @returns {boolean}
       */
      deleteMessages() {
        const messagesToDelete = [];
        const messagesList = document.getElementById('messages-list');
        const checkboxes = messagesList.querySelectorAll('input:checked');

        Array.from(checkboxes).forEach((element, index) => {
          messagesToDelete.push(element.value);
        });

        if (messagesToDelete.length === 0) {
          this.getFlash().append('Vous devez sélectionner au moins un message à supprimer', 'error');
          return false;
        }

        this.getApi().post('messages/delete/', {
          infos: this.getJwtValues({messages: messagesToDelete}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.getFlash().append(data.success_message, 'success');
            this.getAllMessages();
          }
        })
      }
    },
    mounted() {
      this.getAllMessages();
    }
  }
</script>