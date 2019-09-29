<template>
  <div>
    <header class="ribs-container-fluid">
      <nav class="top">
        <nuxt-link to="/map">Carte</nuxt-link>
        <nuxt-link to="/message-box">Messagerie<span v-if="unreadMessageNumber > 0"> ({{unreadMessageNumber}})</span>
        </nuxt-link>
        <nuxt-link to="/fight-simulator">Simulateur de combat</nuxt-link>
        <nuxt-link to="/ranking">Classement</nuxt-link>
        <a @click="displayPremiumPopup()">Premium</a>
        <a id="logout" @click="logout">Se déconnecter</a>
      </nav>
      <div class="row">
        <div id="base" class="cxs-12 cmd-1">{{ base.name }}</div>
        <div id="resources" class="cs-12 cmd-8">
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
        </div>
      </div>
    </header>

    <PremiumPopup ref="premiumPopup" :is-displayed="isDisplayPremiumPopup" @close="closePopup()"/>
  </div>

</template>

<script>
  import Utils from '~/mixins/Utils';
  import PremiumPopup from '~/components/PremiumPopup.vue';

  export default {
    components: {
      PremiumPopup,
    },
    mixins: [Utils],
    data() {
      return {
        isDisplayPremiumPopup: false,
        base: {
          resources: {},
        },
        resourcesInfos: [],
        premiumStorage: {},
        foodConsumptionHour: 0,
        foodString: '',
        premiumFood: {},
        unreadMessageNumber: 0
      };
    },
    methods: {
      /**
       * method to display premium popup
       */
      displayPremiumPopup() {
        this.$refs.premiumPopup.getPremiumConfig();
        this.toggleBodyClassForPopup();
        this.isDisplayPremiumPopup = true;
      },

      /**
       * to close popup
       */
      closePopup() {
        this.isDisplayPremiumPopup = false;
        this.toggleBodyClassForPopup();
      },

      /**
       * method called to refresh resources
       */
      refreshResources() {
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
      setInterval(() => this.refreshResources(), 30000);
    },
    created() {
      if (process.client) {
        this.getApi().post('base/', {
          infos: this.getJwtValues(),
          token: this.getToken(),
        }).then((data) => {
          this.updateTokenIfExist(data.token);
          this.resourcesInfos = data.resources_infos;
          this.setResources(this.base.resources);
          this.setInfoPremiumStorage(data.premium_storage);
          this.base.name = data.base.name;
        });

        this.refreshResources();
      }
    }
  };
</script>