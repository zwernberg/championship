<template>
  <div id="app">
        <h1 class="text-center display-4 mt-5 ">Schumacher Superb Owl</h1>
        <div class="container mt-5" >
            <div class="row" >
                <div class="col-sm-6" v-for='(team,index) in matchup' :key='index'>
                  <div class="text-center">
                        <img class="img-thumbnail rounded" v-bind:src="team.avatarUrl">
                    </div>
                    <h2 class="text-center">{{team.team_name}}</h2>
                    <h5 class="text-center text-muted font-italic">{{team.team_owner}} - {{team.division}} Division Champion</h5>
                    <table class="table">
                        <tbody><tr v-for='(player, index) in sorted(team.players)' :key='index'>
                            <td><p class="text-left font-weight-bold">{{getPosition(player)}}</p></td>
                            <td><p class="text-left">{{player.fullName}}</p></td>
                            <td><p class="text-right">{{player.actualPoints}}</p></td>
                        </tr>
                            <tr><td><p class="text-left font-weight-bold">TOTAL</p></td>
                            <td><p class="text-left"></p></td>
                            <td><p class="text-right font-weight-bold">{{team.actual_total}}</p></td>
                        </tr>
                        <tr>
                            <tr><td><p class="text-left font-weight-bold">Projected</p></td>
                            <td><p class="text-left"></p></td>
                            <td><p class="text-right font-weight-bold">{{team.projected_total}}</p></td>
                        </tr>
                    </tbody></table>
                </div>
              </div>
        </div>

        <div class="container mt-5 pre-scrollable" id="chatWindow" style="height: 200px;">
          <h3>Messages (newest on top)</h3>
          <div class="row" v-for='(message,index) in messages' :key='index'>
            <div class="col-sm-6">
              {{message.name}}: {{message.msg}}
            </div>
          </div>
        </div>
        <div class="container mt-5" >
          <input type="text" class="form-control" v-model="name" placeholder="name">
          <input type="text" class="form-control" v-model="newMessage" placeholder="message">
          <button type="button" class="btn btn-primary" v-on:click="clickButton">Send</button>
        </div>
  </div>
</template>

<script>
import axios from 'axios';
import lodash from 'lodash';
var _ = lodash;

var roster_slots = {0:'QB',1: 'QB', 2:'RB',3:'WR', 4:'WR',5: 'K', 6:'TE',23:'FLEX',16:'D/ST',17:'K',20:'Bench'};


export default {
  name: 'app',
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
    message: function (val) {
      this.messages.unshift(val);
    },
    update: function(val){
      console.log('updated')
      this.matchup = val
    },
    start_messages: function(val) {
      this.messages = val;
    }
  },
  data () {
    return {
      matchup: [],
      messages: [],
      name: '',
      newMessage: '',
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
    },
    clickButton: function(val){
        // $socket is socket.io-client instance
        var data = {
          name: this.name,
          msg: this.newMessage,
        }
        this.newMessage = '';
        this.$socket.emit('message', data);
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
