<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <h1>{{building.name}}</h1>
        <ul>
          <li>Level : {{building.level}}</li>
          <li>{{explanation}}</li>
        </ul>


        <h2>Informations to pass to next level</h2>

        <h3>Resources</h3>
        <ul>
          <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < resources_build.electricity}">{{resources_build.electricity}}</span></li>
          <li>Iron : <span v-bind:class="{'resources-error': resources.iron < resources_build.iron}">{{resources_build.iron}}</span></li>
          <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < resources_build.fuel}">{{resources_build.fuel}}</span></li>
          <li>Water : <span v-bind:class="{'resources-error': resources.water < resources_build.water}">{{resources_build.water}}</span></li>
        </ul>

        <h3>Time</h3>
        <ul>
          <li>Time to build : {{construction_time}}</li>
        </ul>

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
        explanation: '',
        construction_time : null,
        resources_build: {},
        error_messsage: null,
        resources: {}
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
          this.explanation = data.explanation;
          this.construction_time = this.secondToHourMinute(data.construction_time);
          this.resources_build = data.resources_build;
          this.resources = this.building.base.resources;
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
          } else {
            this.getFlash().append('A building is already in construction in your base', 'error');
          }
        });
      }
    }
  }
</script>