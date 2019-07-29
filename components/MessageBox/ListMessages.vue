<template>
  <div>
    <div v-if="messages.length > 0">
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @click="checkAllMessage"></th>
          <th>Recu le</th>
          <th>Lu</th>
          <th><span v-if="type === 'send'">A</span><span v-else>De</span></th>
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
          infos: this.getJwtValues({type: this.messageType}),
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

        Array.from(checkboxes).forEach((element) => {
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