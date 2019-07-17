<template>
  <div>
    <h1>{{building.name}}</h1>
    <ul>
      <li>Level : {{building.level}}</li>
      <li>{{explanation}}</li>
      <li>{{explanationCurrentPower}}</li>
    </ul>


    <h2>Informations to pass to next level</h2>

    <h3>Resources</h3>
    <ul>
      <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < resourcesBuild.electricity}">{{resourcesBuild.electricity}}</span></li>
      <li>Iron : <span v-bind:class="{'resources-error': resources.iron < resourcesBuild.iron}">{{resourcesBuild.iron}}</span></li>
      <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < resourcesBuild.fuel}">{{resourcesBuild.fuel}}</span></li>
      <li>Water : <span v-bind:class="{'resources-error': resources.water < resourcesBuild.water}">{{resourcesBuild.water}}</span></li>
    </ul>

    <h3>Time</h3>
    <ul>
      <li>Time to build : {{constructionTime}}</li>
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
        resources: this.$parent.resources
      }
    },
  }
</script>