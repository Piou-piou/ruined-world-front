<template>
  <div>
    <Nav/>

    <h1>{{message.subject}}</h1>
    <div>
      {{message.message}}
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

            this.getApi().post('message/read/', {
              infos: this.getJwtValues({message_id: localStorage.getItem('message')}),
              token: this.getToken(),
            });
          }
        });
      } else {
        this.$router.push('/message-box');
      }
    }
  }
</script>