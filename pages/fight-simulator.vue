<template>
  <div>
    <Header ref="header"></Header>

    <h1>Simulateur de combat</h1>
    <h2>Créé ta simulation</h2>

    <form action="" id="fight-simulator">
      <h3>Attaque</h3>
      <div v-for="(unitType, key) in unitTypes" :key="key">
        <label>{{unitType.name}}</label>
        <input type="number" v-bind:data-type="'attack'" v-bind:data-arrayname="unitType.array_name" class="unit">
      </div>

      <h3>Défense</h3>
      <div v-for="(unitType, key) in unitTypes" :key="key">
        <label :for="`defense[${unitType.array_name}]`">{{unitType.name}}</label>
        <input type="number" v-bind:data-type="'defense'" v-bind:data-arrayname="unitType.array_name"  class="unit">
      </div>

      <button type="submit" v-on:click.stop.prevent="submit">Simuler</button>
    </form>

    <div v-if="fightResult">
      <h2>Résultats du combat</h2>

      <h3>Attaquant revenus</h3>
      <div v-if="Object.keys(attackUnits).length">
        <ul v-for="(unit, key) in attackUnits" :key="key">
          <li>{{unit.name}} : {{unit.number}}</li>
        </ul>
      </div>
      <div v-else>Tous les attaquants ont été tués</div>

      <h3>défenseur en vie</h3>
      <div v-if="Object.keys(defenseUnits).length">
        <ul v-for="(unit, key) in defenseUnits" :key="key">
          <li>{{unit.name}} : {{unit.number}}</li>
        </ul>
      </div>
      <div v-else>Tous les défenseurs ont été tués</div>
    </div>

  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import Header from '~/components/Header.vue';

  export default {
    components: {
      Header,
    },
    mixins: [Utils],
    data() {
      return {
        unitTypes: {},
        fightResult: false,
        attackUnits: {},
        defenseUnits: {},
      }
    },
    methods: {
      /**
       * method to send units to the fight simulator and get results of it
       */
      submit() {
        const attackUnits = {};
        const defenseUnits = {};
        const inputs = document.getElementsByClassName('unit');

        Array.from(inputs).forEach((element, index) => {
          if (element.value && element.value > 0) {
            if (element.dataset.type === 'attack') {
              attackUnits[element.dataset.arrayname] = element.value;
            } else {
              defenseUnits[element.dataset.arrayname] = element.value;
            }
          }
        });

        this.getApi().post('fight/simulate/', {
          infos: this.getJwtValues({attack_units: attackUnits, defense_units: defenseUnits}),
          token: this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.fightResult = true;
            this.attackUnits = data.attack_units;
            this.defenseUnits = data.defense_units;
          }
        })
      }
    },
    mounted() {
      this.getApi().post('fight/all-units-type/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then(data => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.unitTypes = data.units;
        }
      });
    },
    created() {
    }
  }
</script>
