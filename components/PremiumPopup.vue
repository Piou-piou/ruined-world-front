<template>
  <div>
    <div class="ribs-popup" v-bind:class="{'ribs-displayed': isDisplayed}">
      <div class="content">
        <div class="close" @click="$emit('close')" data-close>X</div>

        <h1>Avantages premium</h1>

        <div>
          <h2>Amélioration construction</h2>
          <p>Avec ce bonus, recrute pendant un temps un chef des constructions qui pourra ajouter un bâtiment de plus à la file d'attente des constructions.</p>

          <h3>Tarifs</h3>
          <ul>
            <li>Pour 3 jours : 5 tougnou <button>Acheter</button></li>
            <li>Pour 15 jours : 20 tougnou <button>Acheter</button></li>
            <li>Pour 30 jours : 30 tougnou <button>Acheter</button></li>
          </ul>

          <hr>
        </div>
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
      }
    },
    methods: {

    }
  }
</script>