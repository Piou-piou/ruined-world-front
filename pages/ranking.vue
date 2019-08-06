<template>
  <div>
    <div>
      <nuxt-link to="/"><button>Index</button></nuxt-link>
    </div>
    <h1>Classement</h1>

    <table>
      <thead>
        <tr>
          <th>Rang</th>
          <th>Pseudo</th>
          <!--<th>Alliance</th>-->
          <th>Points</th>
          <!--<th>Bases</th>-->
        </tr>
      </thead>
      <tbody>
        <tr  v-for="(player, key) in players" :key="key">
          <td></td>
          <td>{{player.pseudo}}</td>
          <td>{{player.points}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    data() {
      return {
        players: {},
        currentPage: null,
        maxPage: null
      }
    },
    methods: {
      /**
       * method to get ranked players
       */
      getRankedPlayers() {
        this.getApi().post('ranking/', {
          infos: this.getJwtValues({page_number: this.currentPage}),
          token: this.getToken(),
        }).then((data) => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.players = data.players;
            this.currentPage = data.max_pages;
            this.maxPage = data.max_pages;
          }
        });
      }
    },
    mounted() {
      this.getRankedPlayers();
    }
  }
</script>