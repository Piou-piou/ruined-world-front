<template>
  <div>
    index de la base

    <button class="logout" @click="logout">
      Se déconnecter
    </button>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    middleware: 'authenticated',
    mixins: [Utils],
    methods: {
      logout() {
        this.$router.push('/logout');
      }
    },
    created() {
      this.testAndUpdateToken();
    }
  }
</script>
