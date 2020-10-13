<template>
  <div>
    <h1>League</h1>

    <div v-if="league">
      league ok

      <button @click="deleteLeague">Dissoudre mon alliance</button>
    </div>
    <div v-else>
      <h2>Créer une alliance</h2>

      <div v-if="embassy && embassy.level > 0">
        <h4>Information pour ton alliance</h4>

        <form action="">
          <div>
            Nom : <input type="text" name="name" v-model="name">
          </div>

          <button  v-on:click.stop.prevent="createLeague">Envoyer</button>
        </form>
      </div>
      <p v-else>Pour créer une alliance tu dois avoir ton embassade au niveau 2</p>
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
        league: this.$parent.league,
        embassy: this.$parent.embassy,
        name: null
      }
    },
    methods: {
      /**
       * league creation
       */
      createLeague() {
        const jwtInfos = this.getJwtValues({
          name: this.name,
          league_id: this.league ? this.league.id : null
        });

        this.getApi().post('embassy/edit/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true) {
            this.getFlash().append(data.success_message, 'success');
            this.league = data.league;
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      },

      /**
       * league deletion
       */
      deleteLeague() {
        const jwtInfos = this.getJwtValues({
          league_id: this.league.id
        });

        this.getApi().post('embassy/delete/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success === true) {
            this.getFlash().append(data.success_message, 'success');
            this.league = null;
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      }
    },
    mounted() {
      console.log(this.embassy);
      console.log(this.$parent.embassy);
    }
  }
</script>