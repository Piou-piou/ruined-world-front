<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <nav>
          <div v-if="tabs.length > 0 && base.guid != getGuidBase()" v-for="(tab, key) of tabs" v-bind:key="key">
            <button v-for="(link, key) of tab" v-bind:key="key" v-on:click="changeComponent(link.url)">{{ link.name }}</button>
          </div>
          <div v-if="base.guid != getGuidBase()">
            <button @click="sendMessage(base.user.id, base.user.pseudo)">Envoyer un message</button>
          </div>
        </nav>

        <Component :is="component" />
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
        this.getApi().post('base/player/', {
          'infos': this.getJwtValues({guid_other_base: guid}),
          'token': this.getToken()
        }).then(data => {
          this.updateTokenIfExist(data.token);
          if (data.success) {
            this.base = data.base;
            this.base.travel_time = data.travel_time;

            this.component = () => getSpecificBase('Base/Default.vue');
            const specificPopup = this.getGameInfos().specific_popup['base'];
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
      },

      /**
       * method to redirect on page to write a message
       * @param userId
       */
      sendMessage(userId, pseudo) {
        localStorage.setItem('message_user_id', userId);
        localStorage.setItem('message_user_pseudo', pseudo);
        this.$router.push('/message-box/write');
      }
    }
  }
</script>