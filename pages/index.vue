<template>
  <div>
	  <div>
		  index de la base
		
		  <button class="logout" @click="logout">
			  Se déconnecter
		  </button>
	  </div>
	  <div>
		 <h2>Nom de la base : {{base.name}}</h2>
		  
		  <h2>Ressources</h2>
		  <ul class="resources">
			  <li><strong>Electricity</strong> : <span v-bind:class="{'max-storage': base.resources.electricity === resources_infos.max_storage}">
          {{base.resources.electricity}}</span> (+{{resources_infos.electricity_production}})
        </li>
			  <li><strong>Iron</strong> : <span v-bind:class="{'max-storage': base.resources.iron === resources_infos.max_storage}">
          {{base.resources.iron}}</span> (+{{resources_infos.iron_production}})
        </li>
			  <li><strong>Fuel</strong> : <span v-bind:class="{'max-storage': base.resources.fuel === resources_infos.max_storage}">
          {{base.resources.fuel}}</span> (+{{resources_infos.fuel_production}})
        </li>
			  <li><strong>Water</strong> : <span v-bind:class="{'max-storage': base.resources.water === resources_infos.max_storage}">
          {{base.resources.water}}</span> (+{{resources_infos.water_production}})
        </li>
			  <li><strong>Food</strong> : <span v-bind:class="{'max-storage': base.resources.food === resources_infos.max_storage}">
          {{base.resources.food}}</span>
        </li>
		  </ul>
		  
		  <h2>Buildings</h2>
		  <ul>
			  <li v-for="(building, key) in base.buildings" v-bind:key="key">
				  {{building.name}} (lvl : {{building.level}})
			  </li>
		  </ul>
	  </div>
  </div>
</template>

<style lang="scss">
  .resources {
    .max-storage {
      color: red;
    }
  }
</style>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
	data() {
      return {
        base: {
          resources: {}
		},
        resources_infos: []
	  }
	},
    methods: {
      logout() {
        this.$router.push('/logout');
      }
    },
    created() {
      this.testAndUpdateToken();
      
      if (process.client) {
        if (this.getGuidBase() === null) {
          const jwtInfos = this.getJwt().sign({
            token: this.getToken(),
            iat: Math.floor(Date.now() / 1000) - 30,
          }, this.getToken());

          this.getApi().post('main-base/', {
            'infos': jwtInfos,
            'token': this.getToken()
          }).then(data => {
            if (data.success === true) {
              this.setGuidBase(data.guid_base);
              this.setToken(data.token);
			} else {
              this.$router.push('/logout');
			}
          });
		}
        
        const jwtInfos = this.getJwt().sign({
          token: this.getToken(),
          iat: Math.floor(Date.now() / 1000) - 30,
          guid_base: this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('base/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.setToken(data.token);
          this.base = JSON.parse(data.base);
          this.resources_infos = data.resources_infos;
        });
	  }
    }
  }
</script>
