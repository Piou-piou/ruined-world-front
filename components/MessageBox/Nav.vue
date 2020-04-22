<template>
  <div>
    <div>
      <nuxt-link to="/message-box"><button>Boite de réception <span v-if="unreadMessages > 0">({{unreadMessages}})</span></button></nuxt-link>
      <nuxt-link to="/message-box/sent-messages"><button>Messages envoyés</button></nuxt-link>
      <nuxt-link to="/message-box/write"><button>Ecrire un message</button></nuxt-link>
      <nuxt-link to="/message-box/fight-reports"><button>Rapport de combat <span v-if="unreadFightReport > 0">({{unreadFightReport}})</span></button></nuxt-link>
      <nuxt-link to="/message-box/other-reports"><button>Autres rapports <span v-if="unreadOtherReport > 0">({{unreadOtherReport}})</span></button></nuxt-link>
    </div>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
    props: {
      type: 0
    },
    data() {
      return {
        unreadMessages: 0,
        unreadFightReport: 0,
        unreadOtherReport: 0
      };
    },
    methods: {},
    mounted() {
      this.getApi().post('message/unread-number-box/', {
        infos: this.getJwtValues(),
        token: this.getToken(),
      }).then((data) => {
        this.updateTokenIfExist(data.token);
        if (data.success) {
          this.unreadMessages = data.unread_messages;
          this.unreadFightReport = data.unread_fight_report;
          this.unreadOtherReport = data.unread_other_report;
          this.refreshUnreadMessageNumber();
        }
      });
    }
  }
</script>