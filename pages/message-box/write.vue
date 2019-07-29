<template>
  <div>
    <Nav/>

    <h1>Ecrire un message</h1>
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
      <button>Envoyer</button>
    </div>

    <input type="hidden" v-model="userId">
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