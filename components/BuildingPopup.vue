<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <div id="set-content">
          <h1>{{building.name}}</h1>
          <ul>
            <li>Level : {{building.level}}</li>
          </ul>


          <h2>Informations to pass to next level</h2>

          <h3>Resources</h3>
          <ul>
            <li>Electricity : {{resources_build.electricity}}</li>
            <li>Iron : {{resources_build.iron}}</li>
            <li>Fuel : {{resources_build.fuel}}</li>
            <li>Water : {{resources_build.water}}</li>
          </ul>

          <h3>Time</h3>
          <ul>
            <li>Time to build : {{construction_time}}</li>
          </ul>
        </div>

        <div>{{error_messsage}}</div>

        <div class="link">
          <a class="cancel" @click="$emit('close')">Cancel</a>
          <a class="validate" @click="build()">Validate</a>
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
        resources_build: {},
        error_messsage: null
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
          this.building = JSON.parse(data.building);
          this.construction_time = this.secondToHourMinute(data.construction_time);
          this.resources_build = data.resources_build;
        });
      },
      build() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
          array_name: this.building.arrayName
        }, this.getToken());

        this.getApi().post('/buildings/build/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          if (data.success === true) {
            this.$emit('close');
            this.$router.push('/');
          } else {
            this.getFlash().append('A building is already in construction in your base', 'error');
          }
        });
      }
    }
  }
</script>