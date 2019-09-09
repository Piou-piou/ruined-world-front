<template>
  <div>
    <h3>Soigner des unités</h3>

    <div>
      <div v-if="Object.keys(units).length > 0">
        <div  v-for="(unit, key) in units" v-bind:key="key">
          <h4>{{unit.name}}</h4>
          <ul>
            <li>Attack power : {{unitConfig[unit.array_name].attack_power}}</li>
            <li>Defense power : {{unitConfig[unit.array_name].defense_power}}</li>
            <li>Move Speed : {{unitConfig[unit.array_name].speed}}</li>
            <li>Transport weight : {{unitConfig[unit.array_name].transport_weight}}</li>
            <li>Time to treat : {{secondToHourMinute(unitConfig[unit.array_name].treatment_time)}}</li>
          </ul>

          <h5>Ressources pour soigner</h5>
          <ul>
            <li>Électricité : <span v-bind:class="{'resources-error': resources.electricity < parseInt(unitConfig[unit.array_name].resources_recruit.electricity/2, 10)}">{{parseInt(unitConfig[unit.array_name].resources_recruit.electricity/2, 10)}}</span></li>
            <li>Fer : <span v-bind:class="{'resources-error': resources.iron < parseInt(unitConfig[unit.array_name].resources_recruit.iron/2, 10)}">{{parseInt(unitConfig[unit.array_name].resources_recruit.iron/2, 10)}}</span></li>
            <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < parseInt(unitConfig[unit.array_name].resources_recruit.fuel/2, 10)}">{{parseInt(unitConfig[unit.array_name].resources_recruit.fuel/2, 10)}}</span></li>
            <li>Eau : <span v-bind:class="{'resources-error': resources.water < parseInt(unitConfig[unit.array_name].resources_recruit.water/2, 10)}">{{parseInt(unitConfig[unit.array_name].resources_recruit.water/2, 10)}}</span></li>
          </ul>

          Soigner : <input type="number" v-bind:class="unit.array_name"> sur xx possible à soigner
          <button type="submit" v-bind:id="unit.array_name" @click="recruitUnit">Soigner</button>
          <hr>
        </div>
      </div>
      <div v-else>
        Aucune unité à soigner actuellement
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        units: {},
        unitConfig: {},
        resources: {}
      }
    },
    methods: {

    },
    mounted() {
      this.getApi().post('units/list-units-to-treat/', {
        'infos': this.getJwtValues(),
        'token': this.getToken(),
      }).then(data => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.units = data.units;
          this.unitConfig = data.unit_config;
          this.resources = this.getResources();
        }
      });
    }
  }
</script>