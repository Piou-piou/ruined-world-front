<template>
  <div>
    <h2>V 0.0.1</h2>

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
      <ul v-if="Object.keys(base.units).length > 0">
        <li v-for="(number, unitName) in base.units" v-bind:key="number">
          {{unitName}} ({{number}})
        </li>
      </ul>
      <div v-else>Aucune unité présente dans la base</div>

      <h2>Bâtiment en construction</h2>
      <div v-if="current_constructions.length > 0">
        <ul  v-for="(current_construction, key) in current_constructions" v-bind:key="key" ref="construction-{{current_construction.id}}">
          <li>bâtiment : {{current_construction.name}}</li>
          <li><RibsCountdown :key="current_construction.id" :end="current_construction.endConstruction" @doActionAfterTimeOver="endConstructions()"></RibsCountdown></li>
        </ul>
      </div>
      <div v-else>Aucun bâtiment en construction</div>
    </div>

    <h2>Unités en recrutement</h2>
    <div v-if="current_units_recruitment.length > 0">
      <ul  v-for="(current_unit, key) in current_units_recruitment" v-bind:key="key" ref="recruitment-{{current_unit.id}}">
        <li>unité : {{current_unit.name}} (nombre en recrutement : {{current_unit.number}})</li>
        <li><RibsCountdown :key="current_unit.id" :end="current_unit.end_recruitment" @doActionAfterTimeOver="endUnitsRecruitment()"></RibsCountdown></li>
      </ul>
    </div>
    <div v-else>Aucun bâtiment en construction</div>

    <h2>Transport en cours</h2>
    <div v-if="current_market_transports.length > 0">
      <ul  v-for="(current_market_transport, key) in current_market_transports" v-bind:key="key">
        <li>
          <div v-if="current_market_transport.base_dest_guid !== getGuidBase()">
            sur le chemin
            <span v-if="current_market_transport.type === 0">de l'allé à</span>
            <span v-else>du retour de</span>
            {{current_market_transport.base_dest_name}}
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()"></RibsCountdown>
          </div>
          <div v-else>
            <span >arrive de {{current_market_transport.base_dest_name}}</span>
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()"></RibsCountdown>
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
  import RibsCountdown from 'ribs-vue-countdown';

  export default {
    components: {
      BuildingPopup,
      ListBuildingToBuildPopup,
      RibsCountdown
    },
    mixins: [Utils],
    data() {
      return {
        current_market_transports: {},
        current_units_recruitment: {},
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

          this.getBuildings();
          this.getUnits();
          this.getCurrentConstructions();
          this.getCurrentMarketMovements();
          this.getUnitsInRecruitment();
        });
      },

      /**
       * method to get buildings of the base
       */
      getBuildings() {
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
       * method to get units of the base
       */
      getUnits() {
        const units = {};

        (this.base.units).forEach((unit, index) => {
          console.log(units[unit.arrayName]);
          if (unit.inRecruitment === false) {
            if (units[unit.arrayName] === undefined) {
              units[unit.arrayName] = 1;
            }
            units[unit.arrayName] += 1;
          }
        });

        console.log(units);

        this.base.units = units;
      },

      /**
       * method to get current recruitments in base
       */
      getUnitsInRecruitment() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('barrack/units-in-recruitment/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.units_in_recruitment.length > 0) {
            this.current_units_recruitment = {};
            this.current_units_recruitment = data.units_in_recruitment;
          } else {
            this.current_units_recruitment = {};
          }
        });
      },

      endUnitsRecruitment() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('barrack/end-recruitments-base/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true && data.units_in_recruitment.length > 0) {
            this.current_units_recruitment = data.units_in_recruitment;
          } else {
            this.units_in_recruitment = {};
          }
          this.getBase();
        })
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
