<template>
  <div>
    <header class="ribs-container-fluid">
      <nav class="top">
        <nuxt-link to="/">Base</nuxt-link>
        <nuxt-link to="/map">Carte</nuxt-link>
        <nuxt-link to="/message-box">Messagerie<span v-if="unreadMessageNumber > 0"> ({{unreadMessageNumber}})</span>
        </nuxt-link>
        <nuxt-link to="/fight-simulator">Simulateur de combat</nuxt-link>
        <nuxt-link to="/ranking">Classement</nuxt-link>
        <a @click="displayPremiumPopup()">Premium</a>
        <a id="logout" @click="logout">Se déconnecter</a>
      </nav>
      <div class="row">
        <div id="base" class="cxs-12 cmd-2 clg-2">{{ base.name }}</div>
        <div id="resources" class="cxs-12 cmd-10 clg-8">
          <ul>
            <li><strong>Électricité</strong> : <span
                    :class="{'resources-error': resources.electricity === resourcesInfos.max_storage_wharehouse}">
          {{ formatNumber(resources.electricity) }}</span> (+{{ resourcesInfos.electricity_production }})
              <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.electricity}}h)</span>
            </li>
            <li><strong>Fer</strong> : <span
                    :class="{'resources-error': resources.iron === resourcesInfos.max_storage_wharehouse}">
          {{ formatNumber(resources.iron) }}</span> (+{{ resourcesInfos.iron_production }})
              <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.iron}}h)</span>
            </li>
            <li><strong>Fuel</strong> : <span
                    :class="{'resources-error': resources.fuel === resourcesInfos.max_storage_wharehouse}">
          {{ formatNumber(resources.fuel) }}</span> (+{{ resourcesInfos.fuel_production }})
              <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.fuel}}h)</span>
            </li>
            <li><strong>Eau</strong> : <span
                    :class="{'resources-error': resources.water === resourcesInfos.max_storage_wharehouse}">
          {{ formatNumber(resources.water) }}</span> (+{{ resourcesInfos.water_production }})
              <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.water}}h)</span>
            </li>
            <li><strong>Nourriture</strong> :
              <span
                      :class="{'resources-error': resources.food === resourcesInfos.max_storage_garner}">
            {{ formatNumber(resources.food) }} <span v-if="resourcesInfos.food_consumption > 0">({{ resourcesInfos.food_consumption }} {{ resourcesInfos.food_string }})</span>
            <span v-if="Object.keys(premiumStorage).length" class="premium"> ({{premiumStorage.food}}h)</span>
          </span>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <PremiumPopup ref="premiumPopup" :is-displayed="isDisplayPremiumPopup" @close="closePopup()"/>

    <nuxt/>
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
        premiumStorage: {},
        foodConsumptionHour: 0,
        foodString: '',
        premiumFood: {},
        unreadMessageNumber: 0
      };
    },
    methods: {
      /**
       * method to get base
       */
      getBase() {
        this.getApi().post('base/', {
          infos: this.getJwtValues(),
          token: this.getToken(),
        }).then((data) => {
          this.updateTokenIfExist(data.token);
          this.setResourcesInfo(data.resources_infos);
          this.setResources(data.base.resources);
          this.setInfoPremiumStorage(data.premium_storage);
          this.base.name = data.base.name;
        });

        this.refreshUnreadMessageNumber();
        this.getUnreadMessageNumber();
      },

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
       * to logout from the game
       */
      logout() {
        this.$router.push('/logout');
      },
    },
    mounted() {
      setInterval(() => this.refreshResources(), 30000);
      setInterval(() => this.getResources(), 1000);
      setInterval(() => this.getUnreadMessageNumber(), 450000);
      setInterval(() => this.getUnreadMessageNumber(), 1000);
    },
    created() {
      this.testAndUpdateToken();

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