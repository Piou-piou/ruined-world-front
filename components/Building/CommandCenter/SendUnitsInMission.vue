<template>
  <div>
    <h3>Liste des missions</h3>

    <div>
      <div  v-for="(mission, key) in missions" v-bind:key="key">
        <h4>{{mission.name}}</h4>
        <p>{{mission.explanation}}</p>
        <ul>
          <li>ressources ramenées : {{mission.type}}</li>
          <li>Ressource en pourcentage que les unités ramèneront par rapport à ce qu'ils peuvent porter : {{mission.win_resources}} %</li>
          <li>Pertes maximale des unités envoyées : {{mission.lost_percentage}} %</li>
          <li>Durée de la mission : {{secondToHourMinute(mission.duration)}}</li>
        </ul>
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
        missions: {}
      }
    },
    methods: {

    },
    mounted() {
      const jwtInfos = this.getJwt().sign({
        token: this.getToken(),
        iat: Math.floor(Date.now() / 1000) - 30,
        guid_base: this.getGuidBase(),
      }, this.getToken());

      this.getApi().post('missions/list/', {
        'infos': jwtInfos,
        'token': this.getToken(),
      }).then(data => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.missions = data.missions;
        }
      });
    }
  }
</script>