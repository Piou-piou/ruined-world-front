<template>
  <div>
    <h3>Liste des unités disponibles pour le recrutement</h3>

    <div>
      <div  v-for="(unit, key) in units" v-bind:key="key">
        <h4>{{unit.name}}</h4>
        <ul>
          <li>Attack power : {{unit.attack_power}}</li>
          <li>Defense power : {{unit.defense_power}}</li>
          <li>Move Speed : {{unit.speed}}</li>
          <li>Transport weigh : {{unit.transport_weight}}</li>
          <li>Time to recruit : {{secondToHourMinute(unit.recruitment_time)}}</li>
        </ul>

        <h5>Ressources pour recruter</h5>
        <ul>
          <li>Électricité : <span v-bind:class="{'resources-error': resources.electricity < unit.resources_recruit.electricity}">{{unit.resources_recruit.electricity}}</span></li>
          <li>Fer : <span v-bind:class="{'resources-error': resources.iron < unit.resources_recruit.iron}">{{unit.resources_recruit.iron}}</span></li>
          <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < unit.resources_recruit.fuel}">{{unit.resources_recruit.fuel}}</span></li>
          <li>Eau : <span v-bind:class="{'resources-error': resources.water < unit.resources_recruit.water}">{{unit.resources_recruit.water}}</span></li>
        </ul>

        Recruter : <input type="number" v-bind:class="unit.array_name"> sur {{unit.max_recruit_possible}} possible à recruter
        <button type="submit" v-bind:id="unit.array_name" @click="recruitUnit">Recruter</button>
        <hr>
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
        resources: {}
      }
    },
    methods: {
      /**
       * method to recruit units
       * @param event
       */
      recruitUnit(event) {
        const unitArrayName = event.currentTarget.id;
        const numberToRecruit = event.currentTarget.parentNode.querySelector(`.${unitArrayName}`).value;

        this.getApi().post('barrack/recruit-units/', {
          'infos': this.getJwtValues({unit_array_name: unitArrayName, number_to_recruit: numberToRecruit}),
          'token': this.getToken(),
        }).then(data => {
          if (data.success) {
            this.updateTokenIfExist(data.token);
            this.getFlash().append(data.success_message, 'success');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      }
    },
    mounted() {
      this.getApi().post('barrack/list-units-to-recruit/', {
        'infos': this.getJwtValues(),
        'token': this.getToken(),
      }).then(data => {
        if (data.success) {
          this.units = data.units;
          this.updateTokenIfExist(data.token);
          this.resources = this.getResources();
        }
      });
    }
  }
</script>