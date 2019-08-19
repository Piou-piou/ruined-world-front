<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <h1>Avantages premium</h1>

        <div v-for="(premium, key) in premiumConfigs" v-bind:key="key">
          <h2>{{premium.title}}</h2>
          <p>{{premium.description}}</p>

          <h3>Tarifs</h3>
          <ul>
            <li>Pour 3 jours : {{premium.cost3}} tougnou <button>Acheter</button></li>
            <li>Pour 15 jours : {{premium.cost15}} tougnou <button>Acheter</button></li>
            <li>Pour 30 jours : {{premium.cost30}} tougnou <button>Acheter</button></li>
          </ul>

          <hr>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    props: {
      'isDisplayed': false
    },
    data() {
      return {
        premiumConfigs: {}
      }
    },
    methods: {
      /**
       * this method get list of premium advantages and their prices available in game
       */
      getPremiumConfig() {console.log('def');
        this.getApi().post('premium/list-advantages/', {
          'infos': this.getJwtValues(),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.premiumConfigs = data.premium_config;
          }
        });
      }
    },
  }
</script>