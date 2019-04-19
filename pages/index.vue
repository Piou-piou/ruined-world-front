<template>
  <div>
    index de la base

    <button class="logout" @click="logout">
      Se déconnecter
    </button>
  </div>
</template>

<script>
  export default {
    middleware: 'authenticated',
    methods: {
      logout() {
        this.$router.push('/logout');
      }
    },
    created() {

    }
  }
</script>
