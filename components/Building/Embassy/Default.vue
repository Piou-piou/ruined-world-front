<template>
  <div>
    <nav>
      <button>My league</button>
      <button>Members</button>
      <button>Forum</button>
    </nav>

    <Component :is="component" />
  </div>
</template>

<script>
import Utils from '~/mixins/Utils';

const getSpecifiqBuilding = slug => ({
  component: import(`~/components/Building/Embassy/${slug}`),
});

export default {
  mixins: [Utils],
  data() {
    return {
      component: false,
      league: null,
      embassy: null
    }
  },
  methods: {

  },
  mounted() {
    this.getApi().post('embassy/show/', {
      'infos': this.getJwtValues(),
      'token': this.getToken(),
    }).then(data => {
      if (data.success) {
        this.league = data.league;
        this.embassy = data.embassy;

        this.component = () => getSpecifiqBuilding('MyLeague.vue');
      }
    });
  },
}
</script>