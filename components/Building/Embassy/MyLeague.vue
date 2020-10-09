<template>
  <div>
    <h1>League</h1>

    <div v-if="league">
      league ok
    </div>
    <div v-else>
      <h2>Créer une alliance</h2>

      <p v-if="embassy && embassy.level > 2">Pour créer une alliance : c'est par ici</p>
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
        league: null,
        embassy: null,
      }
    },
    methods: {
    },
    mounted() {
      this.getApi().post('embassy/show/', {
        'infos': this.getJwtValues(),
        'token': this.getToken(),
      }).then(data => {
        if (data.success) {
          this.league = data.league;
          this.embassy = data.embassy;
          console.log(this.embassy)
          console.log(this.embassy.level)
        }
      });
    },
    created() {}
  }
</script>