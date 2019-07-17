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
             v-bind:class="{
              'my-base': base.guid == getGuidBase(),
              'my-bases': base.guid.indexOf(guids_player_bases) > -1 && base.guid != getGuidBase(),
              'archived': base.archived === true,
             }"
             @mouseover="getTravalTime(base.guid)"
             @click="displayBasePopup(base.guid)"
        >
          <div>
            <p>Base : {{base.name}} de {{base.pseudo}} <span v-show="travel_time != 0">(trajet : {{travel_time}})</span></p>
          </div>
        </div>
      </div>
    </div>

    <BasePopup :isDisplayed=isDisplayBasePopup @close="isDisplayBasePopup = false" ref="basePopup"></BasePopup>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';
  import BasePopup from '~/components/BasePopup.vue';

  export default {
    components: {
      BasePopup
    },
    mixins: [Utils],
    data() {
      return {
        bases: {},
        travel_time: 0,
        guids_player_bases: [],
        id_player: null,
        map_size: this.getGameInfos().map_size,
        map_multiplicator: this.getGameInfos().map_multiplicator,
        isDisplayBasePopup: false,
      }
    },
    methods: {
      /**
       * method to move map based on direction
       * @param direction
       */
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
      },

      /**
       * method to get travel time on hover a base
       * @param base_guid
       */
      getTravalTime(base_guid) {
        if (base_guid !== this.getGuidBase()) {
          const jwtInfos = this.getJwt().sign({
            token: this.getToken(),
            iat: Math.floor(Date.now() / 1000) - 30,
            guid_base: this.getGuidBase(),
            guid_other_base: base_guid
          }, this.getToken());

          this.getApi().post('base/travel-time/', {
            'infos': jwtInfos,
            'token': this.getToken(),
          }).then(data => {
            this.updateTokenIfExist(data.token);
            if (data.success) {
              this.travel_time = data.travel_time;
            }
          });
        }
      },

      /**
       * method call to display a popup of a clicked base
       * @param guid
       */
      displayBasePopup(guid) {
        this.$refs.basePopup.getBase(guid);
        this.isDisplayBasePopup = true;
      },
    },
    mounted() {
      if (!this.getGuidBase()) {
        return;
      }

      this.travel_time = 0;
      const jwtInfos = this.getJwt().sign({
        token: this.getToken(),
        iat: Math.floor(Date.now() / 1000) - 30,
        guid_base: this.getGuidBase(),
      }, this.getToken());

      this.getApi().post('bases-map/', {
        'infos': jwtInfos,
        'token': this.getToken(),
      }).then(data => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.bases = data.bases;
          this.guids_player_bases = data.guids_player_bases;
          this.id_player = data.id_player;
        }
      });
    }
  }
</script>