<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>Schumacher Championship</h1>
    <ul>
      <li v-for='(team,index) in matchup' :key='index'>
        <h3>{{team.team_name}} - {{team.team_owner}}</h3> Projected <b>{{team.projected_total}}</b>
        <ul>
          <li v-for='(player, index) in sorted(team.players)' :key='index'>
            <b>{{getPosition(player)}}</b>: {{player.fullName}}
            <b>Projected</b>: {{player.projectedPoints}}
            <b>Actual</b>: {{player.actualPoints}}

          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import lodash from 'lodash';
var _ = lodash;

var roster_slots = {0:'QB',1: 'QB', 2:'RB',3:'WR', 4:'WR',5: 'K', 6:'TE',23:'FLEX',16:'D/ST',17:'K',20:'Bench'};


export default {
  name: 'app',
  data () {
    return {
      matchup: []
    }
  },
  created() {
    axios.get('http://schumacher.football/api/championship/')
    .then(response => {
      this.matchup=response.data;
    });
  },
  methods: {
    sorted: players => {
      return _.orderBy(players, 'position', 'asc');
    },
    getPosition: player => {
      return roster_slots[player.position];
    },
    projectedPoints: players => {
      var total = 0;
      players.forEach(element => {
        total += element.currentPeriodProjectedStats.appliedStatTotal;
      });
      return Math.round(total * 100) / 100;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
