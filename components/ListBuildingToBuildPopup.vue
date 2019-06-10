<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <div v-if="buildings.length > 0">
          <div v-for="(building, key) in buildings" v-bind:key="key">
            <h2>{{building.name}}</h2>

            <h2>Informations to build</h2>

            <h3>Resources</h3>
            <ul>
              <li>Electricity : <span v-bind:class="{'resources-error': resources.electricity < building.resources_build.electricity}">{{building.resources_build.electricity}}</span></li>
              <li>Iron : <span v-bind:class="{'resources-error': resources.iron < building.resources_build.iron}">{{building.resources_build.iron}}</span></li>
              <li>Fuel : <span v-bind:class="{'resources-error': resources.fuel < building.resources_build.fuel}">{{building.resources_build.fuel}}</span></li>
              <li>Water : <span v-bind:class="{'resources-error': resources.water < building.resources_build.water}">{{building.resources_build.water}}</span></li>
            </ul>

            <h3>Time</h3>
            <ul>
              <li>Time to build : {{building.construction_time}}</li>
            </ul>

            <a href="#">Construire</a>

            <hr>
          </div>
        </div>
        <div v-else>Acun batiment à construire actuellement</div>

        <div class="link">
          <a class="cancel" @click="$emit('close')">Cancel</a>
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
        buildings: {},
        resources: {}
      }
    },
    methods: {
      getBuildings() {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('buildings/list-to-build/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.buildings = data.buildings;
          this.resources = this.getResources();
        });
      }
    }
  }
</script>