<template>
  <div>
    <h1>Evoyer les troupes à {{base.name}}</h1>

    <ul>
      <li>Propriétaire : {{base.user.pseudo}}</li>
      <li>Alliance : non dévelopé</li>
      <li>Base : {{base.name}}</li>
      <li>Coordonnées : {{base.posx}} / {{base.poxy}}</li>
      <li>temps de trajet estimé : {{base.travel_time}}</li>
    </ul>

    <hr>

    <div>
      <h2>Choisis tes unités</h2>
      <div v-if="Object.keys(units).length > 0">
        <div v-for="(unit, key) in units" :key="key">
          <label for="">{{ unit.name }}</label>
          <input type="number" v-bind:data-arrayname="unit.array_name" class="unit">/ {{ unit.number }}
        </div>
      </div>
      <div v-else>Aucune unité présente dans la base</div>
    </div>

    <div class="link">
      <a class="cancel">Attaquer</a>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        base: this.$parent.base,
        units: {}
      }
    },
    methods: {
      /**
       * method to send units to the fight simulator and get results of it
       */
      submit() {
        const units = {};
        const inputs = document.getElementsByClassName('unit');

        Array.from(inputs).forEach((element, index) => {
          if (element.value && element.value > 0) {
            units[element.dataset.arrayname] = element.value;
          }
        });

        this.getApi().post('dont-know', {
          infos: this.getJwtValues({units}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {

          }
        })
      }
    },
    mounted() {
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
    }
  }
</script>