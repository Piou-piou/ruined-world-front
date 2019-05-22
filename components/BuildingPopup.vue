<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <div id="set-content">
          <h1>{{building.name}}</h1>
        </div>

        <div class="link">
          <a class="cancel" @click="$emit('close')">Cancel</a>
          <a href="#" class="validate">Validate</a>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    props: {
      'isDisplayed': false
    },
    data() {
      return {
        building: {},
        construction_time : null,
        resources_build: {}
      }
    },
    methods: {
      getBuilding(array_name) {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
          array_name
        }, this.getToken());

        this.getApi().post('/buildings/show/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          console.log('df');
          this.building = data.building;
          this.construction_time = data.construction_time;
          this.resources_build = data.resources_build;
        });
      }
    }
  }
</script>