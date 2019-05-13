<template>
  <div class="popup" id="popup-test">
    <div class="content">
      <div id="set-content">

      </div>

      <div class="link">
        <a class="cancel" data-close>Cancel</a>
        <a href="#" class="validate" data-validate>Validate</a>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    mounted() {
      if (process.browser) {
        if( document.readyState !== 'loading' ) {
          require('ribs-popup');
        }
      }
    }
  }
</script>