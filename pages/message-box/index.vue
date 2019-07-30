<template>
  <div class="messages">
    <Nav/>
    
    <h1>Messagerie</h1>
    
    <ListMessages type="received"></ListMessages>
  </div>
</template>

<script>
  import Nav from '~/components/MessageBox/Nav.vue';
  import ListMessages from '~/components/MessageBox/ListMessages.vue';

  export default {
    components: {
      Nav,
      ListMessages
    },
  }
</script>