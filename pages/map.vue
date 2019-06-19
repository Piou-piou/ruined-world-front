<template>
  <div>
    <div>
      <nuxt-link to="/"><button>Index</button></nuxt-link>
    </div>
    <h1>Map</h1>

    <div class="map-players">
      <div class="controls" id="top" @click="moveMap('top')"></div>
      <div class="controls" id="right" @click="moveMap('right')"></div>
      <div class="controls" id="bottom" @click="moveMap('bottom')"></div>
      <div class="controls" id="left" @click="moveMap('left')"></div>

      <div v-bind:style="{'width': map_size*map_multiplicator + 'px',  'height': map_size*map_multiplicator + 'px'}"  class="map" ref="map">
        <div v-for="(base, key) in bases"
             v-bind:key="key"
             v-bind:style="{'left': base.posx*map_multiplicator + 'px', 'top': base.posy*map_multiplicator + 'px'}"
             v-bind:class="{'my-base': base.guid == getGuidBase(), 'my-bases': base.guid.indexOf(guids_player_bases) > -1 && base.guid != getGuidBase()}"
        >
          <div>
            <p>Base : {{base.name}} de {{base.pseudo}}</p>
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
        guids_player_bases: [],
        id_player: null,
        map_size: this.getGameInfos().map_size,
        map_multiplicator: this.getGameInfos().map_multiplicator
      }
    },
    methods: {
      moveMap(direction) {
        const deplace = 50;
        let moveDirection = direction;
        moveDirection = moveDirection ==='bottom' ? 'top' : moveDirection;
        moveDirection = moveDirection ==='right' ? 'left' : moveDirection;
        const originalDirection = this.$refs.map.style[moveDirection] === '' ? 0 : parseInt(this.$refs.map.style[moveDirection].split('px')[0], 10);
        const newPosition = direction === 'right' || direction === 'bottom' ? originalDirection-deplace : originalDirection+deplace;
        direction = direction === 'right' ? 'left' : direction;
        direction = direction === 'bottom' ? 'top' : direction;
        this.$refs.map.style[direction] = (newPosition)+'px';
      }
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
          this.guids_player_bases = data.guids_player_bases;
          this.id_player = data.id_player;
        }
      });
    }
  }
</script>