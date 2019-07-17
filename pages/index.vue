<template>
  <div>
    <h2>V {{ game_infos.app_version }}</h2>

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
      <h2>Nom de la base : {{ base.name }}</h2>

      <h2>Ressources</h2>
      <ul>
        <li><strong>Electricity</strong> : <span
          :class="{'resources-error': base.resources.electricity === resources_infos.max_storage_wharehouse}">
          {{ base.resources.electricity }}</span> (+{{ resources_infos.electricity_production }})
        </li>
        <li><strong>Iron</strong> : <span
          :class="{'resources-error': base.resources.iron === resources_infos.max_storage_wharehouse}">
          {{ base.resources.iron }}</span> (+{{ resources_infos.iron_production }})
        </li>
        <li><strong>Fuel</strong> : <span
          :class="{'resources-error': base.resources.fuel === resources_infos.max_storage_wharehouse}">
          {{ base.resources.fuel }}</span> (+{{ resources_infos.fuel_production }})
        </li>
        <li><strong>Water</strong> : <span
          :class="{'resources-error': base.resources.water === resources_infos.max_storage_wharehouse}">
          {{ base.resources.water }}</span> (+{{ resources_infos.water_production }})
        </li>
        <li><strong>Food</strong> :
          <span
            :class="{'resources-error': base.resources.food === resources_infos.max_storage_garner}">
            {{ base.resources.food }} <span v-if="food_consumption_hour > 0">({{ food_consumption_hour }} {{ food_string }})</span>
          </span>
        </li>
      </ul>

      <h2>Buildings</h2>
      <ul>
        <li v-for="(building, key) in base.buildings" :key="key">
          <div v-if="building !== null">
            <div @click="displayBuildingPopup(building.arrayName)">
              {{ building.name }} (lvl : {{ building.level }}) in build {{ building.inConstruction }}</div>
          </div>
          <div v-else @click="displayListBuildingToBuildPopup(key)">Construire</div>
        </li>
      </ul>

      <h2>Unités</h2>
      <ul v-if="Object.keys(units).length > 0">
        <li v-for="(unit, key) in units" :key="key">
          {{ unit.name }} ({{ unit.number }})
        </li>
      </ul>
      <div v-else>Aucune unité présente dans la base</div>

      <h2>Bâtiment en construction</h2>
      <div v-if="current_constructions.length > 0">
        <ul v-for="(current_construction, key) in current_constructions" ref="construction-{{current_construction.id}}" :key="key">
          <li>bâtiment : {{ current_construction.name }}</li>
          <li><RibsCountdown :key="current_construction.id" :end="current_construction.endConstruction" @doActionAfterTimeOver="endConstructions()" /></li>
        </ul>
      </div>
      <div v-else>Aucun bâtiment en construction</div>
    </div>

    <h2>Unités en recrutement</h2>
    <div v-if="current_units_recruitment.length > 0">
      <ul v-for="(current_unit, key) in current_units_recruitment" ref="recruitment-{{current_unit.id}}" :key="key">
        <li>unité : {{ current_unit.name }} (nombre en recrutement : {{ current_unit.number }})</li>
        <li>prochaine unité dans : <RibsCountdown :key="current_unit.id" :end="current_unit.end_recruitment" @doActionAfterTimeOver="endUnitsRecruitment()" /></li>
      </ul>
    </div>
    <div v-else>Aucune unité en recrutement</div>

    <h2>Unités en mouvement</h2>
    <div v-if="current_units_in_movement.length > 0">
      <ul v-for="(current_movement, key) in current_units_in_movement" ref="movement-{{current_unit.id}}" :key="key">
        <li>
          <div v-if="current_movement.string_type === 'mission'">
            En mission pendant encore <RibsCountdown :key="current_movement.end_date" :end="current_movement.end_date" @doActionAfterTimeOver="enUnitMovement()" />
          </div>

          <ul v-for="(unit, key) in current_movement.units" :key="key">
            <li>unité : {{ unit.name }} (nombre : {{ unit.number }})</li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>Aucune unité en mouvement</div>

    <h2>Transport en cours</h2>
    <div v-if="current_market_transports.length > 0">
      <ul v-for="(current_market_transport, key) in current_market_transports" :key="key">
        <li>
          <div v-if="current_market_transport.base_dest_guid !== getGuidBase()">
            sur le chemin
            <span v-if="current_market_transport.type === 0">de l'allé à</span>
            <span v-else>du retour de</span>
            {{ current_market_transport.base_dest_name }}
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()" />
          </div>
          <div v-else>
            <span>arrive de {{ current_market_transport.base_dest_name }}</span>
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()" />
          </div>
        </li>
      </ul>
    </div>
    <div v-else>Aucun transport en cours</div>

    <ListBuildingToBuildPopup ref="listBuildingToBuildPopup" :is-displayed="isDisplayListBuildingToBuildPopup" :case-to-build="caseToBuildNumber" @close="closePopup()" />
    <BuildingPopup ref="buildingPopup" :is-displayed="isDisplayBuildingPopup" @close="closePopup()" />
  </div>
</template>

<script>
import RibsCountdown from 'ribs-vue-countdown';
import Utils from '~/mixins/Utils';
import BuildingPopup from '~/components/BuildingPopup.vue';
import ListBuildingToBuildPopup from '~/components/ListBuildingToBuildPopup.vue';

export default {
  components: {
    BuildingPopup,
    ListBuildingToBuildPopup,
    RibsCountdown,
  },
  mixins: [Utils],
  data() {
    return {
      current_market_transports: {},
      current_units_recruitment: {},
      current_units_in_movement: {},
      emptyLocation: true,
      isDisplayBuildingPopup: false,
      isDisplayListBuildingToBuildPopup: false,
      caseToBuildNumber: null,
      base: {
        resources: {},
      },
      units: {},
      resources_infos: [],
      current_constructions: {},
      game_infos: {},
      food_consumption_hour: 0,
      food_string: '',
      food_kill_hour: 0,
      food_kill_string: '',
    };
  },
  mounted() {
    /**
       * called when page is builded to refresh resources
       */
    setInterval(() => {
      this.getApi().post('refresh-resources/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        this.base.resources.electricity = data.electricity;
        this.base.resources.iron = data.iron;
        this.base.resources.fuel = data.fuel;
        this.base.resources.water = data.water;
        this.base.resources.food = data.food;
        this.setResources(data);
      });
    }, 30000);

    setInterval(() => this.getCurrentMarketMovements(), 60000);
    setInterval(() => this.getUnits(), 300000);
  },
  created() {
    this.testAndUpdateToken();
    this.testUpdateAppVersion();
    this.game_infos = this.getGameInfos();

    if (process.client) {
      if (this.getGuidBase() === null) {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
        }, this.getToken());

        this.getApi().post('main-base/', {
          infos: jwtInfos,
          token: this.getToken(),
        }).then((data) => {
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
      this.getApi().post('base/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        this.base = JSON.parse(data.base);
        this.resources_infos = data.resources_infos;
        this.setResources(this.base.resources);

        this.getBuildings();
        this.getCurrentConstructions();
        this.getUnits();
        this.getCurrentUnitMovements();
        this.getCurrentMarketMovements();
        this.getUnitsInRecruitment();
        this.getFoodConsumptionPerHour();
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
        buildingNumber += 1;
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
      this.getApi().post('buildings/in-construction/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.buildings.length > 0) {
          this.current_constructions = data.buildings;
        }
      });
    },

    /**
       * method to end current constructions that are finished in base
       */
    endConstructions() {
      this.getApi().post('buildings/end-constructions-base/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.buildings.length > 0) {
          this.current_constructions = data.buildings;
        } else {
          this.current_constructions = {};
        }
        this.getBase();
      });
    },

    /**
       * method to get current market movements in base
       */
    getCurrentMarketMovements() {
      this.getApi().post('market/send-current-movements/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
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
      this.getApi().post('market/update-current-movements/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
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
      this.getApi().post('units/list-units-base/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.units.length > 0) {
          this.units = {};
          this.units = data.units;
        } else {
          this.units = {};
        }
      });
    },

    /**
       * method to get current recruitments in base
       */
    getUnitsInRecruitment() {
      this.getApi().post('barrack/units-in-recruitment/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.units_in_recruitment.length > 0) {
          this.current_units_recruitment = {};
          this.current_units_recruitment = data.units_in_recruitment;
        } else {
          this.current_units_recruitment = {};
        }
      });
    },

    /**
       * method calleed at the end of a recruitment of units
       */
    endUnitsRecruitment() {
      this.getApi().post('barrack/end-recruitments-base/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.units_in_recruitment.length > 0) {
          this.current_units_recruitment = data.units_in_recruitment;
        } else {
          this.current_units_recruitment = {};
        }
        this.getBase();
      });
    },

    /**
       * method to get current unit movements in base
       */
    getCurrentUnitMovements() {
      this.getApi().post('units/list-movements/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.unit_movements.length > 0) {
          this.current_units_in_movement = data.unit_movements;
        } else {
          this.current_units_in_movement = {};
        }
      });
    },

    /**
       * method to update movement of units if there is on the go to put it on return
       */
    enUnitMovement() {
      this.getApi().post('missions/update-movements/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        this.getBase();
      });
    },

    /**
       * method to get food consumption per hour
       */
    getFoodConsumptionPerHour() {
      this.getApi().post('food/consumption-per-hour/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.food_consumption_hour = data.food_consumption;
          this.food_string = data.food_string;
          this.food_kill_hour = data.food_kill;
          this.food_kill_string = data.food_string_kill;
        }
      });
    },

    /**
       * to logout from the game
       */
    logout() {
      this.$router.push('/logout');
    },
  },
};
</script>
