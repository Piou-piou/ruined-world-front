<template>
  <div>
    <div v-if="messages.length > 0">
      <table class="general">
        <thead>
        <tr>
          <th><input type="checkbox" @click="checkAllMessage"></th>
          <th>
            <span v-if="type === 'send'">Envoyé le</span>
            <span v-else>Recu le</span>
          </th>
          <th>Lu</th>
          <th>
            <span v-if="type === 'send'">A</span>
            <span v-else>De</span>
          </th>
          <th>Sujet</th>
        </tr>
        </thead>
        <tbody id="messages-list">
        <tr v-for="(message, key) in messages" :key="key">
          <td><input type="checkbox" :value="message.id"></td>
          <td  @click="showMessage(message.id)">{{message.message.formattedSendAt}}</td>
          <td  @click="showMessage(message.id)">
            <span v-if="message.read_at">oui</span>
            <span v-else>non</span>
          </td>
          <td  @click="showMessage(message.id)">
            <span v-if="type === 'send'">{{message.user.pseudo}}</span>
            <span v-else>{{message.message.user.pseudo}}</span>
            
          </td>
          <td  @click="showMessage(message.id)">{{message.message.subject}}</td>
        </tr>
        </tbody>
      </table>

      <div>
        <button @click="updateMessages('delete')">Supprimer</button>
        <button v-if="type !== 'send'" @click="updateMessages('read')">Marquer comme lu</button>
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
    props: {
      type: 0
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
        localStorage.removeItem('message');

        this.getApi().post('message/list/', {
          infos: this.getJwtValues({type: this.type}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          const messages = data.messages;
          if (data.success === true) {
            this.messages = messages;
          }
        });
      },

      /**
       * method to check or uncheck all messages
       */
      checkAllMessage(event) {
        const checkAll = event.currentTarget.checked;
        const checkboxes = document.querySelectorAll('#messages-list input[type=checkbox]');

        Array.from(checkboxes).forEach((element) => {
          element.checked = checkAll;
        });
      },

      /**
       * method to go on page to show a message
       * @param id
       */
      showMessage(id) {
        if (this.type !== 'send') {
          localStorage.setItem('message', id);
          this.$router.push('/message-box/show-message');
        }
      },

      /**
       * method to delete checked messages
       * @returns {boolean}
       */
      updateMessages(status) {
        const apiUrl = status === 'delete' ? 'messages/delete/' : 'messages/read/';
        const messagesToUpdate = [];
        const messagesList = document.getElementById('messages-list');
        const checkboxes = messagesList.querySelectorAll('input:checked');

        Array.from(checkboxes).forEach((element) => {
          messagesToUpdate.push(element.value);
        });

        if (messagesToUpdate.length === 0) {
          this.getFlash().append('Vous devez sélectionner au moins un message pour effectuer cette action', 'error');
          return false;
        }

        this.getApi().post(apiUrl, {
          infos: this.getJwtValues({messages: messagesToUpdate, type: this.type}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.getFlash().append(data.success_message, 'success');
            this.getAllMessages();
            this.refreshUnreadMessageNumber();
          }
        });
      },
    },
    mounted() {
      localStorage.removeItem('message');
      this.getAllMessages();
      this.refreshUnreadMessageNumber();
    }
  }
</script>