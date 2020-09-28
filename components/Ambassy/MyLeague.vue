<template>
  <div>
    <h1>Title</h1>

    <div class="link">
      <a class="cancel">Button</a>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        base: this.$parent.base
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>