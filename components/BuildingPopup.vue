<template>
  <div>
    <div class="popup" v-bind:class="{displayed: isDisplayed}">
      <div class="content">
        <nav>
          <div v-if="tabs.length > 0" v-for="(tab, key) of tabs" v-bind:key="key">
            <button v-for="(link, key) of tab" v-bind:key="key" v-on:click="changeComponent(link.url)">{{ link.name }}</button>
          </div>
        </nav>

        <Component :is="component" />

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

  const getSpecifiqBuilding = slug => ({
    component: import(`~/components/Building/${slug}`),
  });

  export default {
    mixins: [Utils],
    props: {
      'isDisplayed': false
    },
    data() {
      return {
        tabs: [],
        currentTab: 'Default',
        navBuilding: {},
        component: false,
        building: {},
        explanation: '',
        explanation_current_power: '',
        explanation_next_power: '',
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
          this.explanation_current_power = data.explanation_current_power;
          this.explanation_next_power = data.explanation_next_power;
          this.construction_time = this.secondToHourMinute(data.construction_time);
          this.resources_build = data.resources_build;
          this.resources = this.building.base.resources;
          this.component = () => getSpecifiqBuilding('Default.vue');

          const specificPopup = this.getGameInfos().specific_popup[array_name];
          this.tabs = [];
          this.currentTab = 'Default';
          if (specificPopup) {
            this.tabs.push([{name: 'default', url: 'Default'}]);
            this.tabs.push(specificPopup);
          }
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
      },
      changeComponent(url) {
        this.component = () => getSpecifiqBuilding(url);
      }
    }
  }
</script>