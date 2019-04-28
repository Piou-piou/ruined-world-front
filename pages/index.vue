<template>
  <div>
    index de la base

    <button class="logout" @click="logout">
      Se déconnecter
    </button>
  </div>
</template>

<script>
  import Utils from '~/mixins/Utils';

  export default {
    mixins: [Utils],
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
          'guid_base': this.getGuidBase(),
        }, this.getToken());

        this.getApi().post('base/', {
          'infos': jwtInfos,
          'token': this.getToken(),
        }).then(data => {
          this.setToken(data.token);
          console.log(data);
        });
	  }
    }
  }
</script>
