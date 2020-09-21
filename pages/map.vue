<template>
  <div>
    <h1>Carte</h1>

    <div class="map-players">
      <div class="controls" id="top" @click="moveMap('top')"></div>
      <div class="controls" id="right" @click="moveMap('right')"></div>
      <div class="controls" id="bottom" @click="moveMap('bottom')"></div>
      <div class="controls" id="left" @click="moveMap('left')"></div>

      <div v-bind:style="{'width': mapSize*mapMultiplicator + 'px',  'height': mapSize*mapMultiplicator + 'px', 'left': -(mapSize*mapMultiplicator)/2+800+'px', 'top': -(mapSize*mapMultiplicator)/2+400+'px'}"  class="map" ref="map">
        <div v-for="(base, key) in bases"
             v-bind:key="key"
             v-bind:style="{'left': base.posx*mapMultiplicator + 'px', 'top': base.posy*mapMultiplicator + 'px'}"
             v-bind:class="{
              'my-base': base.guid == getGuidBase(),
              'my-bases': base.guid.indexOf(guidsPlayerBases) > -1 && base.guid != getGuidBase(),
              'archived': base.archived === true,
             }"
             @mouseover="getTravalTime(base.guid)"
             @click="displayBasePopup(base.guid)"
        >
          <div>
            <p>Base : {{base.name}} de {{base.pseudo}} <span v-show="travelTime != 0">(trajet : {{travelTime}})</span></p>
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
    layout: 'logged',
    components: {
      BasePopup,
    },
    mixins: [Utils],
    data() {
      return {
        bases: {},
        travelTime: 0,
        guidsPlayerBases: [],
        idPlayer: null,
        mapSize: this.getGameInfos().map_size,
        mapMultiplicator: this.getGameInfos().map_multiplicator,
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
          this.getApi().post('base/travel-time/', {
            'infos': this.getJwtValues({guid_other_base: base_guid}),
            'token': this.getToken(),
          }).then(data => {
            this.updateTokenIfExist(data.token);
            if (data.success) {
              this.travelTime = data.travel_time;
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
      if (process.client) {
        if (!this.getGuidBase()) {
          return;
        }

        this.travelTime = 0;
        this.getApi().post('bases-map/', {
          'infos':  this.getJwtValues(),
          'token': this.getToken(),
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.bases = data.bases;
            this.guidsPlayerBases = data.guids_player_bases;
            this.idPlayer = data.id_player;
          }
        });
      }
    }
  }
</script>