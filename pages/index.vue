<template>
  <div>
    <div>
      index de la base

      <button class="logout" @click="logout">
        Se déconnecter
      </button>
    </div>
    <div>
      <h2>Nom de la base : {{base.name}}</h2>

      <h2>Ressources</h2>
      <ul class="resources">
        <li><strong>Electricity</strong> : <span
          v-bind:class="{'max-storage': base.resources.electricity === resources_infos.max_storage}">
          {{base.resources.electricity}}</span> (+{{resources_infos.electricity_production}})
        </li>
        <li><strong>Iron</strong> : <span
          v-bind:class="{'max-storage': base.resources.iron === resources_infos.max_storage}">
          {{base.resources.iron}}</span> (+{{resources_infos.iron_production}})
        </li>
        <li><strong>Fuel</strong> : <span
          v-bind:class="{'max-storage': base.resources.fuel === resources_infos.max_storage}">
          {{base.resources.fuel}}</span> (+{{resources_infos.fuel_production}})
        </li>
        <li><strong>Water</strong> : <span
          v-bind:class="{'max-storage': base.resources.water === resources_infos.max_storage}">
          {{base.resources.water}}</span> (+{{resources_infos.water_production}})
        </li>
        <li><strong>Food</strong> : <span
          v-bind:class="{'max-storage': base.resources.food === resources_infos.max_storage}">
          {{base.resources.food}}</span>
        </li>
      </ul>

      <h2>Buildings</h2>
      <ul>
        <li v-for="(building, key) in base.buildings" v-bind:key="key">
          <div v-if="building !== null">
            <div @click="displayPopup(building.arrayName)">
              {{building.name}} (lvl : {{building.level}}) in build {{building.inConstruction}}</div>
          </div>
          <div v-else>Construire</div>
        </li>
      </ul>

      <h2>Unités</h2>
      <ul v-if="base.units.length  > 0">
        <li v-for="(unit, key) in base.units" v-bind:key="key">
          {{unit.name}} (lvl : {{unit.level}})
        </li>
      </ul>
      <div v-else>Aucune unité présente dans la base</div>

      <h2>Bâtiment en construction</h2>
      <ul v-if="current_construction.name !== undefined">
        <li>bâtiment : {{current_construction.name}}</li>
        <li>Fin construction : {{current_construction.endConstruction}}</li>
      </ul>
      <div v-else>Aucun bâtiment en construction</div>
    </div>

    <BuildingPopup :isDisplayed=isDisplayPopup @close="closePopup()" ref="buildingPopup"></BuildingPopup>
  </div>
</template>

<style lang="scss">
  .resources {
    .max-storage {
      color: red;
    }
  }
</style>

<script>
  import Utils from '~/mixins/Utils';
  import BuildingPopup from '~/components/BuildingPopup.vue';

  export default {
    components: {
      BuildingPopup
    },
    mixins: [Utils],
    data() {
      return {
        isDisplayPopup: false,
        base: {
          resources: {},
          units: {}
        },
        resources_infos: [],
        current_construction: {},
        game_infos: {}
      }
    },
    methods: {
      /**
       * to open popup to upgrade a building
       */
      displayPopup(building) {
        this.$refs.buildingPopup.getBuilding(building);
        this.isDisplayPopup = true;
      },

      /**
       * to close popup
       */
      closePopup() {
        this.isDisplayPopup = false;
        this.getBase();
      },

      /**
       * return the base informations like resources, buldings, units, ...
       */
      getBase() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('base/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.setToken(data.token);
          this.base = JSON.parse(data.base);
          this.resources_infos = data.resources_infos;

          const buildings = {};

          for (let i = 1; i <= this.game_infos.building_locations; i++) {
            buildings[i] = null;
          }

          for (const building of this.base.buildings) {
            buildings[building.location] = building;
          }

          this.base.buildings = buildings;
        });
      },

      setBuildingToUpdate(building = null) {
        localStorage.setItem('building_array_name', building);
      },

      /**
       * to logout from the game
       */
      logout() {
        this.$router.push('/logout');
      }
    },
    mounted() {
      /**
       * called when page is builded to refresh resources
       */
      setInterval(() => {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase()
        }, this.getToken());

        this.getApi().post('refresh-resources/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          this.base.resources.electricity = data.electricity;
          this.base.resources.iron = data.iron;
          this.base.resources.fuel = data.fuel;
          this.base.resources.water = data.water;
          this.setToken(data.token);
        });
      }, 30000);
    },
    created() {
      this.testAndUpdateToken();
      this.game_infos = this.getGameInfos();

      if (process.client) {
        if (this.getGuidBase() === null) {
          const jwtInfos = this.getJwt().sign({
            token: this.getToken(),
            iat: Math.floor(Date.now() / 1000) - 30,
          }, this.getToken());

          this.getApi().post('main-base/', {
            'infos': jwtInfos,
            'token': this.getToken()
          }).then(data => {
            if (data.success === true) {
              this.setGuidBase(data.guid_base);
              this.setToken(data.token);

              this.getBase();
            } else {
              this.$router.push('/logout');
            }
          });
        } else {
          this.getBase();
        }
      }
    }
  }
</script>
