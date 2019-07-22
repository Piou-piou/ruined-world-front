<template>
  <div>
    <h1>Evoyer les troupes à {{base.name}}</h1>

    <ul>
      <li>Propriétaire : {{base.user.pseudo}}</li>
      <li>Alliance : non dévelopé</li>
      <li>Base : {{base.name}}</li>
      <li>Coordonnées : {{base.posx}} / {{base.poxy}}</li>
      <li>temps de trajet estimé : {{base.travel_time}}</li>
    </ul>
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