<template>
  <div class="messages">
    <Nav/>

    <h1>Rapports de combat</h1>

    <ListMessages type="fight-report"></ListMessages>
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