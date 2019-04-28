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
		  <ul>
			  <li><strong>Electricity</strong> : {{base.resources.electricity}}</li>
			  <li><strong>Iron</strong> : {{base.resources.iron}}</li>
			  <li><strong>Fuel</strong> : {{base.resources.fuel}}</li>
			  <li><strong>Water</strong> : {{base.resources.water}}</li>
			  <li><strong>Food</strong> : {{base.resources.food}}</li>
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

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
	data() {
      return {
        base: {
          resources: {}
		}
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
        });
	  }
    }
  }
</script>
