<template>
  <div>

  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        base: this.$parent.base,
      }
    },
  }
</script>