"use strict";function _classCallCheck(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function _toConsumableArray(e){if(Array.isArray(e)){for(var a=0,n=Array(e.length);e.length>a;a++)n[a]=e[a];return n}return Array.from(e)}var createPlayer=function(){return{x:0,y:0,vx:0,vy:0,ax:0,ay:0}},createGame=function(){var e=new Set,a=function(a){e.forEach(function(e){var n=e.player,r=e.pointer;if(r){n.ax=r.x-r.cw/2,n.ay=r.y-r.ch/2;5>Math.abs(n.ax)?n.ax=0:(n.ax>0&&(n.ax-=5),0>n.ax&&(n.ax+=5)),5>Math.abs(n.ay)?n.ay=0:(n.ay>0&&(n.ay-=5),0>n.ay&&(n.ay+=5)),n.vx+=n.ax*a/1e3,n.vy+=n.ay*a/1e3,n.vx*=.98,n.vy*=.98,n.x+=n.vx*a/100,n.y+=n.vy*a/100}})},n=function(){e.forEach(function(e){e.socket.emit("s:player",e.player.x,e.player.y)})},r=Date.now(),t=setInterval(function(){var e=Date.now();a(e-r),n(),r=e},30);return{addUser:function(a){e.add(a),a.player=createPlayer()},get usersCount(){return e.size},destroy:function(){clearInterval(t)}}},createUser=function(e){return new function a(){_classCallCheck(this,a),this.socket=e,this.game=null,this.player=null,this.pointer=null}},findOrCreateGame=function(){var e=[].concat(_toConsumableArray(games)).find(function(e){return 2>e.usersCount});return e||(e=createGame(),games.add(e)),e},users=new Set,games=new Set,index=function(e){console.log("connect: "+e.id);var a=createUser(e);users.add(a);var n=findOrCreateGame();a.game=n,n.addUser(a),e.on("disconnect",function(){console.log("disconnect: "+e.id),users.delete(a)}),e.on("c:pointer",function(e){a.game&&(a.pointer=e)})};module.exports=index;
