<template>
  <div>
    <h1>{{building.name}}</h1>
    <ul>
      <li>Level : {{building.level}}</li>
      <li>{{explanation}}</li>
      <li>{{explanationCurrentPower}}</li>
    </ul>


    <h2>Informations pour passer au niveau suivant</h2>

    <h3>Ressources</h3>
    <ul>
      <li>Électricité : <span v-bind:class="{'resources-error': resources.electricity < resourcesBuild.electricity}">{{resourcesBuild.electricity}}</span></li>
      <li>Fer : <span v-bind:class="{'resources-error': resources.iron < resourcesBuild.iron}">{{resourcesBuild.iron}}</span></li>
      <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < resourcesBuild.fuel}">{{resourcesBuild.fuel}}</span></li>
      <li>Eau : <span v-bind:class="{'resources-error': resources.water < resourcesBuild.water}">{{resourcesBuild.water}}</span></li>
    </ul>

    <h3>Temps</h3>
    <ul>
      <li v-if="premiumWhenUpgrade > 0" class="premium">Il sera possible de construire ce bâtiment dans {{premiumWhenUpgrade}}h</li>
      <li>Temps pour construire : {{constructionTime}}</li>
      <li>{{explanationNextPower}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        building: this.$parent.building,
        explanation: this.$parent.explanation,
        explanationCurrentPower: this.$parent.explanationCurrentPower,
        explanationNextPower: this.$parent.explanationNextPower,
        constructionTime : this.$parent.constructionTime,
        resourcesBuild: this.$parent.resourcesBuild,
        resources: this.$parent.resources,
        premiumWhenUpgrade: this.$parent.premiumWhenUpgrade
      }
    },
  }
</script>