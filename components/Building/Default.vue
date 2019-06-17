<template>
  <div>
    <h1>{{building.name}}</h1>
    <ul>
      <li>Level : {{building.level}}</li>
      <li>{{explanation}}</li>
      <li>{{explanation_current_power}}</li>
    </ul>


    <h2>Informations to pass to next level</h2>

    <h3>Resources</h3>
    <ul>
      <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < resources_build.electricity}">{{resources_build.electricity}}</span></li>
      <li>Iron : <span v-bind:class="{'resources-error': resources.iron < resources_build.iron}">{{resources_build.iron}}</span></li>
      <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < resources_build.fuel}">{{resources_build.fuel}}</span></li>
      <li>Water : <span v-bind:class="{'resources-error': resources.water < resources_build.water}">{{resources_build.water}}</span></li>
    </ul>

    <h3>Time</h3>
    <ul>
      <li>Time to build : {{construction_time}}</li>
      <li>{{explanation_next_power}}</li>
    </ul>

    <div>{{error_messsage}}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        building: this.$parent.building,
        explanation: this.$parent.explanation,
        explanation_current_power: this.$parent.explanation_current_power,
        explanation_next_power: this.$parent.explanation_next_power,
        construction_time : this.$parent.construction_time,
        resources_build: this.$parent.resources_build,
        error_messsage: this.$parent.error_messsage,
        resources: this.$parent.resources
      }
    },
  }
</script>