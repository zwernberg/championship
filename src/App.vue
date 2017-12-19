<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>Schumacher Championship</h1>
    <h3> Little Minnies  - Neal Schumacher</h3> Projected {{projectedPoints(nealPlayers)}}
    <ul>
      <li v-for='(player, index) in sorted(nealPlayers)' :key='index'>
        <b>Name</b>: {{player.player.firstName}}  {{player.player.lastName}}
        <b>Position</b>: {{getPosition(player)}}
        <b>Projected</b>: {{player.currentPeriodProjectedStats.appliedStatTotal}}
      </li>
    </ul>
    <h3> Quinley's Mother  - Kensey Schultz </h3> Projected {{projectedPoints(kenseyPlayers)}}
    <ul>
      <li v-for='(player, index) in sorted(kenseyPlayers)' :key='index'>
        <b>Name</b>: {{player.player.firstName}}  {{player.player.lastName}}
        <b>Position</b>: {{getPosition(player)}}
        <b>Projected</b>: {{player.currentPeriodProjectedStats.appliedStatTotal}}
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
      nealPlayers: [],
      kenseyPlayers: [],
    }
  },
  created() {
    axios.get('http://games.espn.com/ffl/api/v2/playerInfo?seasonId=2017&leagueId=1477590&useCurrentPeriodRealStats=true&useCurrentPeriodProjectedStats=true&playerId=16724,18218,13981,16800,15072,15839,14198,9354')
    .then(response => {
      this.nealPlayers=response.data.playerInfo.players;
    });
    axios.get('http://games.espn.com/ffl/api/v2/playerInfo?seasonId=2017&leagueId=1477590&useCurrentPeriodRealStats=true&useCurrentPeriodProjectedStats=true&playerId=13994,12514,17683,14912,17929,17668,17933,18409')
    .then(response => {
      this.kenseyPlayers=response.data.playerInfo.players;
    });
  },
  methods: {
    sorted: players => {
      return _.orderBy(players, 'player.defaultPositionId', 'asc');
    },
    getPosition: player => {
      return roster_slots[player.player.defaultPositionId];
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
