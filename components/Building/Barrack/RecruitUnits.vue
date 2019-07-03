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

        <h5>Resources to recruit</h5>
        <ul>
          <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < unit.resources_recruit.electricity}">{{unit.resources_recruit.electricity}}</span></li>
          <li>Iron : <span v-bind:class="{'resources-error': resources.iron < unit.resources_recruit.iron}">{{unit.resources_recruit.iron}}</span></li>
          <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < unit.resources_recruit.fuel}">{{unit.resources_recruit.fuel}}</span></li>
          <li>Water : <span v-bind:class="{'resources-error': resources.water < unit.resources_recruit.water}">{{unit.resources_recruit.water}}</span></li>
        </ul>

        Recruit : <input type="number" v-model="number_to_recruit" name="number_to_recruit"> on xx available
        <button>Recruit</button>
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
    mounted() {
      const jwtInfos = this.getJwt().sign({
        token: this.getToken(),
        iat: Math.floor(Date.now() / 1000) - 30,
        guid_base: this.getGuidBase(),
      }, this.getToken());

      this.getApi().post('barrack/list-units-to-recruit/', {
        'infos': jwtInfos,
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