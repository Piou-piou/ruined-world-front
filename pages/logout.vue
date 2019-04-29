<template>
  <div>

  </div>
</template>

<script>
  export default {
    created() {
      this.$router.push('/login');
    },
    mounted() {
      localStorage.removeItem('token');
      localStorage.removeItem('guid_base');
    }
  }
</script>
