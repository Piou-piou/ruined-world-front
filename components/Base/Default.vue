<template>
  <div>
    <h1>{{base.name}}</h1>
    <ul>
      <li>Appartient à {{base.user.pseudo}}</li>
      <li>Points : {{base.points}}</li>
      <li>Posx : {{base.posx}}</li>
      <li>Posy : {{base.posy}}</li>
      <li>Temps de trajet : {{base.travel_time}}</li>
    </ul>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        base: this.$parent.base,
      }
    },
  }
</script>