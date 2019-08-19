<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <h1>Avantages premium</h1>

        <div v-for="(premium, key) in premiumConfigs" v-bind:key="key">
          <h2>{{premium.title}}</h2>
          <p>{{premium.description}}</p>

          <div v-if="!(key in enabledAdvantages)">
            <h3>Tarifs</h3>
            <ul>
              <li>Pour 3 jours : {{premium.cost3}} tougnou <button @click="buyAdvantage(premium.array_name, 'cost3')">Acheter</button></li>
              <li>Pour 15 jours : {{premium.cost15}} tougnou <button @click="buyAdvantage(premium.array_name, 'cost15')">Acheter</button></li>
              <li>Pour 30 jours : {{premium.cost30}} tougnou <button @click="buyAdvantage(premium.array_name, 'cost30')">Acheter</button></li>
            </ul>
          </div>
          <div v-else>
            <h3>Actif pendant encore</h3>
            <RibsCountdown :key="key" :end="enabledAdvantages[key].timestamp" />
          </div>
          <hr>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import RibsCountdown from 'ribs-vue-countdown';
  import Utils from '~/mixins/Utils';

  export default {
    components: {
      RibsCountdown,
    },
    mixins: [Utils],
    props: {
      'isDisplayed': false
    },
    data() {
      return {
        premiumConfigs: {},
        enabledAdvantages: {}
      }
    },
    methods: {
      /**
       * this method get list of premium advantages and their prices available in game
       */
      getPremiumConfig() {
        this.getApi().post('premium/list-advantages/', {
          'infos': this.getJwtValues(),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.premiumConfigs = data.premium_config;
            this.enabledAdvantages = data.enabled_advantages === null ? {} : data.enabled_advantages;
          }
        });
      },

      /**
       * method to buy a premium advantage
       * @param arrayName
       * @param cost
       */
      buyAdvantage(arrayName, cost) {
        this.getApi().post('premium/buy-advantage/', {
          'infos': this.getJwtValues({cost: cost, array_name: arrayName}),
          'token': this.getToken()
        }).then(data => {
          if (data.success === true) {
            this.getFlash().append(data.success_message, 'success');
            this.$emit('close');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        })
      }
    },
  }
</script>