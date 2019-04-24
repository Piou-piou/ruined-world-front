<template>
  <div>

  </div>
</template>

<script>
  const Cookie = process.client ? require('js-cookie') : undefined;

  export default {
    created() {
      this.$store.commit('setAuth', null);
      this.$router.push('/login');
    },
    mounted() {
      localStorage.removeItem('token');
      Cookie.set('token', '');
    }
  }
</script>
