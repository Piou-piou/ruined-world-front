<template>
  <div>
    <h3>Envoyer des ressources à une base en saisissant ses coordonnées</h3>
    <form action="">
      x: <input type="text" name="posx" v-model="posx">
      y: <input type="text" name="posy" v-model="posy">
      <button  v-on:click.stop.prevent="submit">Envoyer</button>
    </form>
  </div>
</template>