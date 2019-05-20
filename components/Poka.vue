<template>
  <div> <!-- some generic modal component, wrapping a CSS modal -->
    <h1>test titre</h1>
    <button @click="$router.go(-1)">close</button>
  </div>
</template>

<script>
  export default {
    name: 'Poka',
    data() {
      return {
        item: null
      }
    },
    created() {
      // use $route.params.id to get the item for that ID from whereever you have stored all the items.
      console.log('dfdf')
    }
  }
</script>