<template>
  <div>
    <h3>Liste des missions</h3>

    <div>
      <div v-for="(mission, key) in missions" v-bind:key="key">
        <h4>{{mission.name}}</h4>
        <p>{{mission.explanation}}</p>
        <ul>
          <li>ressources ramenées : {{mission.type}}</li>
          <li>Ressource en pourcentage que les unités ramèneront par rapport à ce qu'ils peuvent porter :
            {{mission.win_resources}} %
          </li>
          <li>Pertes maximale des unités envoyées : {{mission.lost_percentage}} %</li>
          <li>Durée de la mission : {{secondToHourMinute(mission.duration)}}</li>
          <li>Gains potentiel de ressources : 0</li>
        </ul>
        <div>
          <div v-for="(unit, key) in units" v-bind:key="key">
            <label>{{unit.name}}</label>
            <input type="hidden" class="array_name" v-bind:value="unit.array_name">
            <input type="number"> / {{unit.number}}
          </div>
          <button type="submit" v-bind:id="mission.id" @click="sendUnit">Envoyer</button>
        </div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        missions: {},
        units: {}
      }
    },
    methods: {
      /**
       * method that get missions list
       */
      getMissionsList() {
        this.getApi().post('missions/list/', {
          'infos': this.getJwtValues(),
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.missions = data.missions;
            this.units = data.units;
          }
        });
      },

      /**
       * method to send unit in a mission
       * @param event
       */
      sendUnit(event) {
        const target = event.currentTarget;
        const missionId = target.id;
        const unitInputs = target.parentNode.querySelectorAll('input[type=number]');
        const units = {};

        Array.from(unitInputs).forEach((element, index) => {
          const arrayName = element.parentNode.querySelector('.array_name').value;
          const number = parseInt(element.value, 10);

          if (number !== '' && number !== undefined && Number.isInteger(number)) {
            units[arrayName] = {};
            units[arrayName].number = number;
          }
        });

        this.getApi().post('missions/send-units/', {
          'infos': this.getJwtValues({mission_id: missionId, units: units}),
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.getFlash().append(data.success_message, 'success');
            this.getMissionsList()
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      }
    },
    mounted() {
      this.getMissionsList();
    }
  }
</script>