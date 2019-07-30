<template>
  <div class="messages">
    <Nav/>

    <h1>Messages envoyés</h1>

    <ListMessages type="send"></ListMessages>
  </div>
</template>

<script>
  import Nav from '~/components/MessageBox/Nav.vue';
  import ListMessages from '~/components/MessageBox/ListMessages.vue';

  export default {
    components: {
      Nav,
      ListMessages
    }
  }
</script>