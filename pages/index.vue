<template>
  <div>
    <div>
      index de la base
      <div>
        <nuxt-link to="/map"><button>map</button></nuxt-link>
      </div>

      <button class="logout" @click="logout">
        Se déconnecter
      </button>
    </div>
    <div>
      <h2>Nom de la base : {{base.name}}</h2>

      <h2>Ressources</h2>
      <ul>
        <li><strong>Electricity</strong> : <span
          v-bind:class="{'resources-error': base.resources.electricity === resources_infos.max_storage}">
          {{base.resources.electricity}}</span> (+{{resources_infos.electricity_production}})
        </li>
        <li><strong>Iron</strong> : <span
          v-bind:class="{'resources-error': base.resources.iron === resources_infos.max_storage}">
          {{base.resources.iron}}</span> (+{{resources_infos.iron_production}})
        </li>
        <li><strong>Fuel</strong> : <span
          v-bind:class="{'resources-error': base.resources.fuel === resources_infos.max_storage}">
          {{base.resources.fuel}}</span> (+{{resources_infos.fuel_production}})
        </li>
        <li><strong>Water</strong> : <span
          v-bind:class="{'resources-error': base.resources.water === resources_infos.max_storage}">
          {{base.resources.water}}</span> (+{{resources_infos.water_production}})
        </li>
        <li><strong>Food</strong> : <span
          v-bind:class="{'resources-error': base.resources.food === resources_infos.max_storage}">
          {{base.resources.food}}</span>
        </li>
      </ul>

      <h2>Buildings</h2>
      <ul>
        <li v-for="(building, key) in base.buildings" v-bind:key="key">
          <div v-if="building !== null">
            <div @click="displayBuildingPopup(building.arrayName)">
              {{building.name}} (lvl : {{building.level}}) in build {{building.inConstruction}}</div>
          </div>
          <div v-else @click="displayListBuildingToBuildPopup(key)">Construire</div>
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
      <div v-if="current_constructions.length > 0">
        <ul  v-for="(current_construction, key) in current_constructions" v-bind:key="key" ref="construction-{{current_construction.id}}">
          <li>bâtiment : {{current_construction.name}}</li>
          <li><Countdown :key="current_construction.id" :end="current_construction.endConstruction" @doActionAfterTimeOver="endConstructions()"></Countdown></li>
        </ul>
      </div>
      <div v-else>Aucun bâtiment en construction</div>
    </div>

    <h2>Transport en cours</h2>
    <div v-if="current_market_transports.length > 0">
      <ul  v-for="(current_market_transport, key) in current_market_transports" v-bind:key="key">
        <li>
          <div v-if="current_market_transport.base_dest_guid !== getGuidBase()">
            sur le chemin
            <span v-if="current_market_transport.type === 0">de l'allé à</span>
            <span v-else>du retour de</span>
            {{current_market_transport.base_dest_name}}
            <Countdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()"></Countdown>
          </div>
          <div v-else>
            <span >arrive de {{current_market_transport.base_dest_name}}</span>
            <Countdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()"></Countdown>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>Aucun transport en cours</div>

    <ListBuildingToBuildPopup :isDisplayed=isDisplayListBuildingToBuildPopup :caseToBuild=caseToBuildNumber @close="closePopup()" ref="listBuildingToBuildPopup"></ListBuildingToBuildPopup>
    <BuildingPopup :isDisplayed=isDisplayBuildingPopup @close="closePopup()" ref="buildingPopup"></BuildingPopup>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import BuildingPopup from '~/components/BuildingPopup.vue';
  import ListBuildingToBuildPopup from '~/components/ListBuildingToBuildPopup.vue';
  import Countdown from '~/components/Countdown.vue';

  export default {
    components: {
      BuildingPopup,
      ListBuildingToBuildPopup,
      Countdown
    },
    mixins: [Utils],
    data() {
      return {
        current_market_transports: {},
        emptyLocation: true,
        isDisplayBuildingPopup: false,
        isDisplayListBuildingToBuildPopup: false,
        caseToBuildNumber: null,
        base: {
          resources: {},
          units: {}
        },
        resources_infos: [],
        current_constructions: {},
        game_infos: {}
      }
    },
    methods: {
      /**
       * to open popup to upgrade a building
       */
      displayBuildingPopup(building) {
        this.$refs.buildingPopup.getBuilding(building);
        this.toggleBodyClassForPopup();
        this.isDisplayBuildingPopup = true;
      },

      /**
       * to open popup to list building to build
       */
      displayListBuildingToBuildPopup(caseNumber) {
        if (this.emptyLocation) {
          this.caseToBuildNumber = caseNumber;
          this.$refs.listBuildingToBuildPopup.getBuildings();
          this.isDisplayListBuildingToBuildPopup = true;
          this.toggleBodyClassForPopup();
        }
      },

      /**
       * to close popup
       */
      closePopup() {
        this.isDisplayBuildingPopup = false;
        this.isDisplayListBuildingToBuildPopup = false;
        this.toggleBodyClassForPopup();
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
          this.updateTokenIfExist(data.token);
          this.base = JSON.parse(data.base);
          this.resources_infos = data.resources_infos;
          this.setResources(this.base.resources);

          const buildings = {};
          let buildingNumber = 0;

          for (let i = 1; i <= this.game_infos.building_locations; i++) {
            buildings[i] = null;
          }

          for (const building of this.base.buildings) {
            buildings[building.location] = building;
            buildingNumber = buildingNumber +1;
          }

          if (buildingNumber === this.game_infos.building_locations) {
            this.emptyLocation = false;
          }

          this.base.buildings = buildings;
          this.getCurrentConstructions();
          this.getCurrentMarketMovements();
        });
      },

      /**
       * method to get current construction in base
       */
      getCurrentConstructions() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('buildings/in-construction/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.buildings.length > 0) {
            this.current_constructions = data.buildings;
          }
        })
      },

      /**
       * method to end current constructions that are finished in base
       */
      endConstructions() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('buildings/end-constructions-base/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.buildings.length > 0) {
            this.current_constructions = data.buildings;
          } else {
            this.current_constructions = {};
          }
          this.getBase();
        })
      },

      /**
       * method to get current market movements in base
       */
      getCurrentMarketMovements() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('market/send-current-movements/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.market_movements.length > 0) {
            this.current_market_transports = data.market_movements;
          }
        });
      },

      /**
       * method to update movement if there is on the go to put it on return
       */
      updateMarketMovement() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('market/update-current-movements/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.market_movements.length > 0) {
            this.current_market_transports = {};
            this.current_market_transports = data.market_movements;
          } else {
            this.current_market_transports = {};
          }
        });
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
          this.updateTokenIfExist(data.token);
          this.base.resources.electricity = data.electricity;
          this.base.resources.iron = data.iron;
          this.base.resources.fuel = data.fuel;
          this.base.resources.water = data.water;
          this.setResources(data);
        });
      }, 30000);

      setInterval(() => this.getCurrentMarketMovements(), 60000);
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
            this.updateTokenIfExist(data.token);
            if (data.success === true) {
              this.setGuidBase(data.guid_base);

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
