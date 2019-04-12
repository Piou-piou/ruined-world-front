<template>
  <form action="">
    <label for="pseudo">Pseudo</label>
    <input type="text" name="pseudo">
    <label for="password">Mot de passe</label>
    <input type="password" name="password">
  </form>
</template>

<script>
  export default {
    middleware: 'notAuthenticated',
  }
</script>
