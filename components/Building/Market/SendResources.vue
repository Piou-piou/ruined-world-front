<template>
  <div>
    <h3>Envoyer des ressources à une base en saisissant ses coordonnées</h3>
    <h4>Vous avez actuellement {{traderNumber}}/{{maxTraderNumber}} marchands disponible(s) dans votre base</h4>
    <form action="">
      <div>
        Électricité : <input type="number" name="electricity" v-model="electricity">
      </div>
      <div>
        Fuel : <input type="number" name="fuel" v-model="fuel">
      </div>
      <div>
        Fer : <input type="number" name="iron" v-model="iron">
      </div>
      <div>
        Eau : <input type="number" name="water" v-model="water">
      </div>
      <div>
        Nourriture : <input type="number" name="food" v-model="food">
      </div>
      <div>
        x: <input type="text" name="posx" v-model="posx">
        y: <input type="text" name="posy" v-model="posy">
      </div>
      <button  v-on:click.stop.prevent="submit">Envoyer</button>
    </form>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        traderNumber: null,
        maxTraderNumber: null,
        electricity: null,
        fuel: null,
        iron: null,
        water: null,
        food: null,
        posx: null,
        posy: null,
      }
    },
    methods: {
      submit() {
        const jwtInfos = this.getJwtValues({
          resources: {
            electricity: this.electricity === null ? 0 : this.electricity,
            fuel: this.fuel === null ? 0 : this.fuel,
            iron: this.iron === null ? 0 : this.iron,
            water: this.water === null ? 0 : this.water,
            food: this.food === null ? 0 : this.food,
          },
          posx: this.posx,
          posy: this.posy
        });

        this.getApi().post('market/send-resources/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true) {
            this.getFlash().append(data.success_message, 'success');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      }
    },
    mounted() {
      this.getApi().post('market/send-current-market-number/', {
        'infos': this.getJwtValues(),
        'token': this.getToken(),
      }).then(data => {
        if (data.success) {
          this.traderNumber = data.trader_number;
          this.maxTraderNumber = data.max_trader_number;
        }
      });
    }
  }
</script>