<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <nav>
          <div v-if="tabs.length > 0" v-for="(tab, key) of tabs" v-bind:key="key">
            <button v-for="(link, key) of tab" v-bind:key="key" v-on:click="changeComponent(link.url)">{{ link.name }}</button>
          </div>
        </nav>

        <Component :is="component" />

        <div class="link" v-if="building.level < maxLevel && displayBuildButton">
          <a class="validate" @click="build()">Améliorer</a>
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
        maxLevel: null,
        explanation: '',
        explanationCurrentPower: '',
        explanationNextPower: '',
        constructionTime : null,
        resourcesBuild: {},
        resources: {},
        premiumWhenUpgrade: 0,
        displayBuildButton: true
      }
    },
    methods: {
      /**
       * method that get infos about a building
       * @param array_name
       */
      getBuilding(array_name) {
        this.getApi().post('buildings/show/', {
          'infos': this.getJwtValues({array_name: array_name}),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.building = data.building;
            this.maxLevel = data.max_level;
            this.explanation = data.explanation;
            this.explanationCurrentPower = data.explanation_current_power;
            this.explanationNextPower = data.explanation_next_power;
            this.constructionTime = this.secondToHourMinute(data.construction_time);
            this.resourcesBuild = data.resources_build;
            this.resources = this.getResources();
            this.premiumWhenUpgrade = data.premium_when_upgrade;
            this.component = () => getSpecifiqBuilding('Default.vue');
            this.displayBuildButton = true;

            const specificPopup = this.getGameInfos().specific_popup[array_name];
            this.tabs = [];
            this.currentTab = 'Default';
            if (specificPopup) {
              this.tabs.push([{name: 'default', url: 'Default'}]);
              this.tabs.push(specificPopup);
            }
          } else {
            this.$emit('close');
            this.getFlash().append(data.error_message, 'error');
          }
        });
      },

      /**
       * methot that launch construction of building
       */
      build() {
        this.getApi().post('buildings/build/', {
          'infos': this.getJwtValues({array_name: this.building.array_name}),
          'token': this.getToken()
        }).then(data => {
          if (data.success === true) {
            this.refreshResources();
            this.$emit('close');
          } else {
            this.getFlash().append(data.error_message, 'error');
          }
        });
      },

      /**
       * method to load specific component of a building
       * @param url
       */
      changeComponent(url) {
        this.displayBuildButton = url === 'Default';
        this.component = () => getSpecifiqBuilding(url);
      }
    }
  }
</script>