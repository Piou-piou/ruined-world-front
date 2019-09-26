<template>
  <div>
    <h2>V {{ gameInfos.app_version }}</h2>

    <div>
      index de la base
      <div>
        <nuxt-link to="/map"><button>Carte</button></nuxt-link>
        <nuxt-link to="/message-box"><button>Messagerie<span v-if="unreadMessageNumber > 0"> ({{unreadMessageNumber}})</span></button></nuxt-link>
        <nuxt-link to="/fight-simulator"><button>Simulateur de combat</button></nuxt-link>
        <nuxt-link to="/ranking"><button>Classement</button></nuxt-link>
        <button @click="displayPremiumPopup()">Premium</button>
      </div>

      <button class="logout" @click="logout">
        Se déconnecter
      </button>
    </div>
    <div>
      <h2>Nom de la base : {{ base.name }}</h2>

      <h2>Ressources</h2>
      <ul>
        <li><strong>Électricité</strong> : <span
          :class="{'resources-error': base.resources.electricity === resourcesInfos.max_storage_wharehouse}">
          {{ base.resources.electricity }}</span> (+{{ resourcesInfos.electricity_production }})
          <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.electricity}}h)</span>
        </li>
        <li><strong>Fer</strong> : <span
          :class="{'resources-error': base.resources.iron === resourcesInfos.max_storage_wharehouse}">
          {{ base.resources.iron }}</span> (+{{ resourcesInfos.iron_production }})
          <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.iron}}h)</span>
        </li>
        <li><strong>Fuel</strong> : <span
          :class="{'resources-error': base.resources.fuel === resourcesInfos.max_storage_wharehouse}">
          {{ base.resources.fuel }}</span> (+{{ resourcesInfos.fuel_production }})
          <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.fuel}}h)</span>
        </li>
        <li><strong>Eau</strong> : <span
          :class="{'resources-error': base.resources.water === resourcesInfos.max_storage_wharehouse}">
          {{ base.resources.water }}</span> (+{{ resourcesInfos.water_production }})
          <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.water}}h)</span>
        </li>
        <li><strong>Nourriture</strong> :
          <span
            :class="{'resources-error': base.resources.food === resourcesInfos.max_storage_garner}">
            {{ base.resources.food }} <span v-if="resourcesInfos.food_consumption > 0">({{ resourcesInfos.food_consumption }} {{ resourcesInfos.food_string }})</span>
            <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.food}}h)</span>
          </span>
        </li>
      </ul>

      <h2>Bâtiments</h2>
      <ul>
        <li v-for="(building, key) in base.buildings" :key="key">
          <div v-if="building !== null">
            <div @click="displayBuildingPopup(building.array_name)">
              {{ building.name }} (lvl : {{ building.level }}) in build {{ building.in_construction }}</div>
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
      <div v-if="currentConstructions.length > 0">
        <ul v-for="(current_construction, key) in currentConstructions" ref="construction-{{current_construction.id}}" :key="key">
          <li>bâtiment : {{ current_construction.name }}</li>
          <li v-if="Math.trunc((new Date()).getTime() / 1000) > current_construction.startConstruction || current_construction.startConstruction === null"><RibsCountdown :key="current_construction.id" :end="current_construction.endConstruction" @doActionAfterTimeOver="endConstructions()" /></li>
          <li v-else>En attente de la fin de construction</li>
        </ul>
      </div>
      <div v-else>Aucun bâtiment en construction</div>
    </div>

    <h2>Unités en recrutement</h2>
    <div v-if="currentUnitsRecruitment.length > 0">
      <ul v-for="(current_unit, key) in currentUnitsRecruitment" ref="recruitment-{{current_unit.id}}" :key="key">
        <li>unité : {{ current_unit.name }} (nombre en recrutement : {{ current_unit.number }})</li>
        <li>prochaine unité dans : <RibsCountdown :key="current_unit.id" :end="current_unit.end_recruitment" @doActionAfterTimeOver="endUnitsRecruitment()" /></li>
      </ul>
    </div>
    <div v-else>Aucune unité en recrutement</div>

    <h2>Unités en guérison</h2>
    <div v-if="currentUnitsTreatment.length > 0">
      <ul v-for="(current_unit, key) in currentUnitsTreatment" ref="recruitment-{{current_unit.id}}" :key="key">
        <li>unité : {{ current_unit.name }} (nombre en guérison : {{ current_unit.number }})</li>
        <li>prochaine unité soignée dans : <RibsCountdown :key="current_unit.end_treatment" :end="current_unit.end_treatment" @doActionAfterTimeOver="endUnitsTreatment()" /></li>
      </ul>
    </div>
    <div v-else>Aucune unité en guérison</div>

    <h2>Unités en mouvement</h2>
    <div v-if="currentUnitsInMovement.length > 0">
      <ul v-for="(current_movement, key) in currentUnitsInMovement" ref="movement-{{current_unit.id}}" :key="key">
        <li>
          <div v-if="current_movement.string_type === 'mission'">
            En mission pendant encore <RibsCountdown :key="current_movement.end_date" :end="current_movement.end_date" @doActionAfterTimeOver="updateUnitMovement()" />
          </div>
          <div v-else-if="current_movement.string_type === 'attack'">
            <div v-if="current_movement.base_id === base.id">
              <span v-if="current_movement.movement_type_string === 'go'">temps avant l'arrivée pour l'attaque à {{current_movement.entity_name}}</span>
              <span v-if="current_movement.movement_type_string === 'return'">sur le retour de l'attaque de {{current_movement.entity_name}}</span>
            </div>
            <div v-else>
              l'attaque de {{current_movement.base_name}} arrivera dans
            </div>
            <RibsCountdown :key="current_movement.end_date" :end="current_movement.end_date" @doActionAfterTimeOver="updateUnitMovement()" />
          </div>

          <ul v-for="(unit, key) in current_movement.units" :key="key">
            <li>unité : {{ unit.name }} (nombre : {{ unit.number }})</li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>Aucune unité en mouvement</div>

    <h2>Transport en cours</h2>
    <div v-if="currentMarketRransports.length > 0">
      <ul v-for="(current_market_transport, key) in currentMarketRransports" :key="key">
        <li>
          <div v-if="current_market_transport.base_dest_guid !== getGuidBase()">
            sur le chemin
            <span v-if="current_market_transport.type === 0">de l'allé à</span>
            <span v-else>du retour de</span>
            {{ current_market_transport.base_dest_name }}
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()" />
          </div>
          <div v-else>
            <span>arrive de {{ current_market_transport.base_name }}</span>
            <RibsCountdown :key="current_market_transport.endTransport" :end="current_market_transport.endTransport" @doActionAfterTimeOver="updateMarketMovement()" />
          </div>
        </li>
      </ul>
    </div>
    <div v-else>Aucun transport en cours</div>

    <ListBuildingToBuildPopup ref="listBuildingToBuildPopup" :is-displayed="isDisplayListBuildingToBuildPopup" :case-to-build="caseToBuildNumber" @close="closePopup()" />
    <BuildingPopup ref="buildingPopup" :is-displayed="isDisplayBuildingPopup" @close="closePopup()" />
    <PremiumPopup ref="premiumPopup" :is-displayed="isDisplayPremiumPopup" @close="closePopup()" />
  </div>
</template>

<script>
import RibsCountdown from 'ribs-vue-countdown';
import Utils from '~/mixins/Utils';
import BuildingPopup from '~/components/BuildingPopup.vue';
import ListBuildingToBuildPopup from '~/components/ListBuildingToBuildPopup.vue';
import PremiumPopup from '~/components/PremiumPopup.vue';

export default {
  components: {
    BuildingPopup,
    ListBuildingToBuildPopup,
    PremiumPopup,
    RibsCountdown,
  },
  mixins: [Utils],
  data() {
    return {
      currentMarketRransports: {},
      currentUnitsRecruitment: {},
      currentUnitsInMovement: {},
      currentUnitsTreatment: {},
      emptyLocation: true,
      isDisplayBuildingPopup: false,
      isDisplayPremiumPopup: false,
      isDisplayListBuildingToBuildPopup: false,
      caseToBuildNumber: null,
      base: {
        resources: {},
      },
      units: {},
      resourcesInfos: [],
      premiumStorage: {},
      currentConstructions: {},
      gameInfos: {},
      foodConsumptionHour: 0,
      foodString: '',
      premiumFood: {},
      unreadMessageNumber: 0
    };
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

    displayPremiumPopup() {
      this.$refs.premiumPopup.getPremiumConfig();
      this.toggleBodyClassForPopup();
      this.isDisplayPremiumPopup = true;
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
      this.isDisplayPremiumPopup = false;
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
        this.base = data.base;
        this.resourcesInfos = data.resources_infos;
        this.setResources(this.base.resources);
        this.setInfoPremiumStorage(data.premium_storage);

        this.getBuildings();
        this.getCurrentConstructions();
        this.getUnits();
        this.getCurrentUnitMovements();
        this.getCurrentMarketMovements();
        this.getUnitsInRecruitment();
        this.getUnitsInTreatment();
        this.getUnreadMessageNumber();
      });
    },

    /**
       * method to get buildings of the base
       */
    getBuildings() {
      const buildings = {};
      let buildingNumber = 0;

      for (let i = 1; i <= this.gameInfos.building_locations; i++) {
        buildings[i] = null;
      }

      for (const building of this.base.buildings) {
        buildings[building.location] = building;
        buildingNumber += 1;
      }

      if (buildingNumber === this.gameInfos.building_locations) {
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
          this.currentConstructions = data.buildings;
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
          this.currentConstructions = data.buildings;
        } else {
          this.currentConstructions = {};
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
          this.currentMarketRransports = data.market_movements;
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
          this.currentMarketRransports = {};
          this.currentMarketRransports = data.market_movements;
        } else {
          this.currentMarketRransports = {};
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
          this.currentUnitsRecruitment = {};
          this.currentUnitsRecruitment = data.units_in_recruitment;
        } else {
          this.currentUnitsRecruitment = {};
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
          this.currentUnitsRecruitment = data.units_in_recruitment;
        } else {
          this.currentUnitsRecruitment = {};
        }
        this.getUnits();
      });
    },

    /**
     * method to get current treatments in base
    */
    getUnitsInTreatment() {
      this.getApi().post('infirmary/units-in-treatment/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.units_in_treatment.length > 0) {
          this.currentUnitsTreatment = {};
          this.currentUnitsTreatment = data.units_in_treatment;
        } else {
          this.currentUnitsTreatment = {};
        }
      });
    },

    /**
     * method called at the end of a treatment of units
     */
    endUnitsTreatment() {
      this.getApi().post('infirmary/end-treatments-base/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success === true && data.units_in_treatment.length > 0) {
          this.currentUnitsTreatment = data.units_in_treatment;
        } else {
          this.currentUnitsTreatment = {};
        }
        this.getUnits();
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
          this.currentUnitsInMovement = data.unit_movements;
        } else {
          this.currentUnitsInMovement = {};
        }
      });
    },

    /**
       * method to update movement of units if there is on the go to put it on return
       */
    updateUnitMovement() {
      this.getApi().post('units/update-movements/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        this.getBase();
      });
    },

    /**
     * method to get unread message number
     */
    getUnreadMessageNumber() {
      this.getApi().post('message/unread-number/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.unreadMessageNumber = data.nb_unread;
        }
      });
    },

    setInfoPremiumStorage(premiumStorage) {
      if (Object.keys(premiumStorage).length > 0) {
        this.premiumStorage = premiumStorage;
      } else {
        this.premiumStorage = {};
      }
    },

    /**
       * to logout from the game
       */
    logout() {
      this.$router.push('/logout');
    },
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

        this.foodConsumptionHour = data.food_consumption;
        this.foodString = data.food_string;
        
        this.setInfoPremiumStorage(data.premium_storage);
        this.setResources(data);
      });
    }, 30000);

    setInterval(() => this.getCurrentMarketMovements(), 70000);
    setInterval(() => this.getCurrentUnitMovements(), 40000);
    setInterval(() => this.getUnits(), 330000);
    setInterval(() => this.getUnreadMessageNumber(), 450000);
  },
  created() {
    this.testAndUpdateToken();
    this.testUpdateAppVersion();
    this.gameInfos = this.getGameInfos();

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
  }
};
</script>
