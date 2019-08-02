<template>
  <div>
    <div>
      <nuxt-link to="/"><button>Index</button></nuxt-link>
    </div>

    <div>
      <nuxt-link to="/message-box"><button>Boite de réception</button></nuxt-link>
      <nuxt-link to="/message-box/sent-messages"><button>Messages envoyés</button></nuxt-link>
      <nuxt-link to="/message-box/write"><button>Ecrire un message</button></nuxt-link>
      <nuxt-link to="/message-box/fight-reports"><button>Rapport de combat</button></nuxt-link>
      <nuxt-link to="/message-box/other-reports"><button>Autres rapports</button></nuxt-link>
    </div>
  </div>
</template>