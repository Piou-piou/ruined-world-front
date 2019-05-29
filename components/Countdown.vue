<template>
  <div class="vuejs-countdown">
    <span>
      {{ days | twoDigits }} {{ days > 1 ? 'days' : 'day' }}
    </span>
    <span>
      {{ hours | twoDigits }} {{ hours > 1 ? 'hours' : 'hour' }}
    </span>
    <span>
      {{ minutes | twoDigits }} min
    </span>
    <span>
      {{ seconds | twoDigits }} sec
    </span>
  </div>
</template>

<script>
  let interval = null;
  export default {
    name: 'vuejsCountDown',
    props: {
      end: 0,
    },
    data() {
      return {
        now: Math.trunc((new Date()).getTime() / 1000),
        date: null,
        diff: 0
      }
    },
    created() {
      this.date = this.end;
      interval = setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000);
      }, 1000);
    },
    computed: {
      seconds() {
        return Math.trunc(this.diff) % 60
      },
      minutes() {
        return Math.trunc(this.diff / 60) % 60
      },
      hours() {
        return Math.trunc(this.diff / 60 / 60) % 24
      },
      days() {
        return Math.trunc(this.diff / 60 / 60 / 24)
      }
    },
    watch: {
      now(value) {
        this.diff = this.date - this.now;
        if(this.diff <= 0){
          this.diff = 0;
          clearInterval(interval);
        }
      }
    },
    filters: {
      twoDigits(value) {
        if ( value.toString().length <= 1 ) {
          return '0'+value.toString()
        }
        return value.toString()
      }
    }
  }
</script>