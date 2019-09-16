<template>
  <div>
    <h3>Soigner des unités</h3>

    <div>
      <div v-if="Object.keys(units).length > 0">
        <div  v-for="(unit, key) in units" v-bind:key="key">
          <h4>{{unit.unitname}}</h4>
          <ul>
            <li>Attack power : {{unitConfig[unit.unit.array_name].attack_power}}</li>
            <li>Defense power : {{unitConfig[unit.unit.array_name].defense_power}}</li>
            <li>Move Speed : {{unitConfig[unit.unit.array_name].speed}}</li>
            <li>Transport weight : {{unitConfig[unit.unit.array_name].transport_weight}}</li>
            <li>Time to treat : {{secondToHourMinute(unit.treatment_time)}}</li>
          </ul>

          <h5>Ressources pour soigner</h5>
          <ul>
            <li>Électricité : <span v-bind:class="{'resources-error': resources.electricity < unit.resources_to_treat.electricity}">{{unit.resources_to_treat.electricity}}</span></li>
            <li>Fer : <span v-bind:class="{'resources-error': resources.iron < unit.resources_to_treat.iron}">{{unit.resources_to_treat.iron}}</span></li>
            <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < unit.resources_to_treat.fuel}">{{unit.resources_to_treat.fuel}}</span></li>
            <li>Eau : <span v-bind:class="{'resources-error': resources.water < unit.resources_to_treat.water}">{{unit.resources_to_treat.water}}</span></li>
            <li>Nourriture : <span v-bind:class="{'resources-error': resources.water < unit.resources_to_treat.food}">{{unit.resources_to_treat.food}}</span></li>
          </ul>

          Soigner : <input type="number" v-bind:class="unit.unit.array_name"> sur {{unit.possible_to_treat}}/{{unit.number_to_treat}} possible à soigner
          <button type="submit" v-bind:id="unit.unit.array_name" @click="treatUnit">Soigner</button>
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
      /**
       * method that get units that are possible to treat
       */
      getUnitsToTreat() {
        this.getApi().post('infirmary/list-units-to-treat/', {
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
      },

      /**
       * method to recruit units
       * @param event
       */
      treatUnit(event) {
        const unitArrayName = event.currentTarget.id;
        const numberToRecruit = event.currentTarget.parentNode.querySelector(`.${unitArrayName}`).value;

        this.getApi().post('infirmary/treat-units/', {
          'infos': this.getJwtValues({unit_array_name: unitArrayName, number_to_recruit: numberToRecruit}),
          'token': this.getToken(),
        }).then(data => {
          if (data.success) {
            this.updateTokenIfExist(data.token);
            this.getFlash().append(data.success_message, 'success');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
          this.getUnitsToTreat();
        });
      }
    },
    mounted() {
      this.getUnitsToTreat();
    }
  }
</script>