<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <div id="set-content">

        </div>

        <div class="link">
          <a class="cancel" @click="$emit('close')">Cancel</a>
          <a href="#" class="validate">Validate</a>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      'isDisplayed': false
    },
    methods: {
      getBuilding(array_name) {

      }
    }
  }
</script>