<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <div v-if="nbBuildings > 0">
          <div v-for="(building, key) in buildings" v-bind:key="key">
            <h2>{{building.name}}</h2>

            <h2>Informations to build</h2>
            <p>{{building.explanation}}</p>

            <h3>Resources</h3>
            <ul>
              <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < building.resources_build.electricity}">{{building.resources_build.electricity}}</span></li>
              <li>Iron : <span v-bind:class="{'resources-error': resources.iron < building.resources_build.iron}">{{building.resources_build.iron}}</span></li>
              <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < building.resources_build.fuel}">{{building.resources_build.fuel}}</span></li>
              <li>Water : <span v-bind:class="{'resources-error': resources.water < building.resources_build.water}">{{building.resources_build.water}}</span></li>
            </ul>

            <h3>Time</h3>
            <ul>
              <li>Time to build : {{secondToHourMinute(building.construction_time)}}</li>
              <li>{{building.explanation_next_power}}</li>
            </ul>

            <a href="#" @click="build(building.array_name)">Construire</a>

            <hr>
          </div>
        </div>
        <div v-else>Acun batiment à construire actuellement</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    props: {
      'isDisplayed': false,
      'caseToBuild': null
    },
    data() {
      return {
        buildings: {},
        nbBuildings: {},
        resources: {}
      }
    },
    methods: {
      /**
       * method to get all buildings that are possible to build
       */
      getBuildings() {
        this.getApi().post('buildings/list-to-build/', {
          'infos': this.getJwtValues(),
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          this.buildings = data.buildings;
          this.nbBuildings = data.nb_buildings;
          this.resources = this.getResources();
        });
      },

      /**
       * method to build a building
       */
      build(arrayName) {
        this.getApi().post('buildings/build/', {
          'infos': this.getJwtValues({case: this.caseToBuild, array_name: arrayName}),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true) {
            this.$emit('close');
          } else {
            this.getFlash().append('A building is already in construction in your base', 'error');
          }
        });
      }
    }
  }
</script>