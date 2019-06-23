<template>
  <div>
    <h3>Envoyer des ressources à une base en saisissant ses coordonnées</h3>
    <form action="">
      <div>
        Electricity : <input type="number" name="electricity" v-model="electricity">
      </div>
      <div>
        Fuel : <input type="number" name="fuel" v-model="fuel">
      </div>
      <div>
        Iron : <input type="number" name="iron" v-model="iron">
      </div>
      <div>
        Water : <input type="number" name="water" v-model="water">
      </div>
      <div>
        Food : <input type="number" name="food" v-model="food">
      </div>
      <div>
        x: <input type="text" name="posx" v-model="posx">
        y: <input type="text" name="posy" v-model="posy">
      </div>
      <button  v-on:click.stop.prevent="submit">Envoyer</button>
    </form>
  </div>
</template>