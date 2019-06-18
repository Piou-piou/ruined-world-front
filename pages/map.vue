<template>
  <div>
    <div>
      <nuxt-link to="/"><button>Index</button></nuxt-link>
    </div>
    <h1>Map</h1>

    <div class="map-players">
      <div class="controls" id="top" direction="top"></div>
      <div class="controls" id="right" direction="right"></div>
      <div class="controls" id="bottom" direction="bottom"></div>
      <div class="controls" id="left" direction="left"></div>

      <div v-bind:style="{'width': map_size*map_multiplicator + 'px',  'height': map_size*map_multiplicator + 'px'}"  class="map">
        <div v-for="(base, key) in bases" v-bind:key="key" v-bind:style="{'left': base.posx*map_multiplicator + 'px', 'top': base.posy*map_multiplicator + 'px'}">
          <div>
            <p>Base : {{base.name}}</p>
          </div>
        </div>

        <div style="left:30px;top:30px;">
          <div>
            <p>Base : sdf du joueur : sfd</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    components: {
    },
    mixins: [Utils],
    data() {
      return {
        bases: {},
        map_size: this.getGameInfos().map_size,
        map_multiplicator: this.getGameInfos().map_multiplicator
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

      this.getApi().post('bases-map/', {
        'infos': jwtInfos,
        'token': this.getToken(),
      }).then(data => {
        if (data.success) {
          this.bases = data.bases;
        }
      });
    }
  }
</script>