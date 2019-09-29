<template>
  <div class="messages">
    <Nav/>

    <h1>Autres rapports</h1>

    <ListMessages type="other-report"></ListMessages>
  </div>
</template>

<script>
  import Nav from '~/components/MessageBox/Nav.vue';
  import ListMessages from '~/components/MessageBox/ListMessages.vue';

  export default {
    layout: 'logged',
    components: {
      Nav,
      ListMessages
    },
  }
</script>