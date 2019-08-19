<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    props: {
      'isDisplayed': false
    },
    data() {
      return {
      }
    },
    methods: {

    }
  }
</script>