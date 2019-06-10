<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">

        <div class="link">
          <a class="cancel" @click="$emit('close')">Cancel</a>
        </div>
        <div class="clear"></div>
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
  }
</script>