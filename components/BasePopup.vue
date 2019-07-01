<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <nav>
          <div v-if="tabs.length > 0" v-for="(tab, key) of tabs" v-bind:key="key">
            <button v-for="(link, key) of tab" v-bind:key="key" v-on:click="changeComponent(link.url)">{{ link.name }}</button>
          </div>
        </nav>

        <Component :is="component" />

        <div class="link">
          <!--<a class="cancel" @click="$emit('close')">Cancel</a>-->
          <a class="validate" @click="$emit('close')">Close</a>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  const getSpecificBase = slug => ({
    component: import(`~/components/${slug}`),
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
        base: {}
      }
    },
    methods: {
      /**
       * method that get infos about a base
       * @param guid
       */
      getBase(guid) {
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
          guid_other_base: guid,
        }, this.getToken());

        this.getApi().post('base/player/', {
          'infos': jwtInfos,
          'token': this.getToken()
        }).then(data => {
          if (data.success) {
            this.base = JSON.parse(data.base);
            this.base.travel_time = data.travel_time;

            this.component = () => getSpecificBase('Base/Default.vue');
            const specificPopup = this.getGameInfos().specific_popup[array_name];
            this.tabs = [];
            this.currentTab = 'Default';
            if (specificPopup) {
              this.tabs.push([{name: 'default', url: 'Default'}]);
              this.tabs.push(specificPopup);
            }
          }
        });
      },

      /**
       * method to load specific component of a building
       * @param url
       */
      changeComponent(url) {
        this.component = () => getSpecificBase(url);
      }
    }
  }
</script>