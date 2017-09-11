!function(){"use strict";function e(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);e.length>t;t++)r[t]=e[t];return r}return Array.from(e)}var t=["assets/hole.svg","assets/stamp.svg","assets/tree.svg","assets/eye.svg","assets/stamp2.svg","assets/eye_closed.svg","assets/heart.svg","assets/projectile.svg","assets/arrow.svg","assets/powerup.svg"],r=0,o=t.reduce(function(e,t){var o=document.createElement("img");return o.src=t,o.addEventListener("load",function(){r++}),e[/(\w*)\.svg/g.exec(t)[1]]=o,e},{}),n=function(){return r===t.length},s=function(){function e(e,t){var r=[],o=!0,n=!1,s=void 0;try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done)&&(r.push(a.value),!t||r.length!==t);o=!0);}catch(e){n=!0,s=e}finally{try{!o&&i.return&&i.return()}finally{if(n)throw s}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function(e,t,r){e.globalAlpha=1,e.globalCompositeOperation="source-over",e.fillStyle="#2c5b1e",e.fillRect(0,0,t,r)},i=function(e,t){e.save(),e.strokeStyle="#fff",e.lineWidth=5,e.shadowColor="#000",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=1,e.setLineDash([10,5]),e.strokeRect(0,0,t.width,t.height),e.restore()},l=function(e,t){e.save(),e.setLineDash([10,5]),t.forEach(function(t){var r=t.x,n=t.y,s=t.r,a=2*s/o.tree.width,i=o.tree.width*a,l=o.tree.height*a;e.drawImage(o.tree,r-s,n-s-(l-2*s),i,l)}),e.restore()},h=function(e,t){e.save(),t.forEach(function(t){var r=t.x,n=t.y,s=t.r,a=2*s/o.hole.width,i=2*s/o.hole.height,l=o.hole.width*a,h=o.hole.height*i;e.drawImage(o.hole,r-s,n-s,l,h)}),e.restore()},f=[o.eye,o.eye,o.eye,o.eye,o.eye_closed],d=function(e,t,r,o){var n=f[Math.round(o/500)%5];e.save(),e.fillStyle="rgba(255, 255, 255, 0.7)",e.font="bold 12px sans-serif",e.textAlign="center",e.shadowColor="rgba(0, 0, 0, 0.5)",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=2,e.drawImage(n,t-n.width/2,r-n.height/2),e.restore()},c=function(e,t){e.save(),e.fillStyle="rgba(255, 255, 255, 0.7)",e.font="bold 12px sans-serif",e.textAlign="center",e.textBaseline="top",e.shadowColor="rgba(0, 0, 0, 0.5)",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=1,t.forEach(function(t){var r=t.x,n=t.y,s=t.username;e.drawImage(o.eye,r-o.eye.width/2,n-o.eye.height/2),e.fillText(s,r,n+15)}),e.restore()},u=function(e,t){e.save(),e.fillStyle="rgba(255, 255, 255, 1)",e.shadowColor="rgba(0, 0, 0, 0.5)",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=1,t.forEach(function(t){var r=t.x,o=t.y;e.beginPath(),e.arc(r,o,3,0,2*Math.PI,!1),e.fill()}),e.restore()},y=function(e,t,r){e.save(),e.fillStyle="rgba(255, 255, 255, 0.5)",e.lineWidth=3,e.strokeStyle="#fff",e.shadowColor="rgba(0, 0, 0, 0.5)",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=2,e.beginPath(),e.arc(t,r,5,0,2*Math.PI,!1),e.stroke(),e.restore()},w=function(e,t){e.save(),e.fillStyle="rgba(255, 255, 255, 0.5)",e.lineWidth=3,e.strokeStyle="#fff",e.shadowColor="rgba(0, 0, 0, 1)",e.shadowOffsetX=1,e.shadowOffsetY=1,e.shadowBlur=2,e.font="bold 12px sans-serif",e.textAlign="start",e.textBaseline="top",Object.entries(t).forEach(function(t,r){var o=s(t,2),n=o[0],a=o[1];e.fillText(n+": "+a,10,10+15*r)}),e.restore()},p=function(){function e(e,t){var r=[],o=!0,n=!1,s=void 0;try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done)&&(r.push(a.value),!t||r.length!==t);o=!0);}catch(e){n=!0,s=e}finally{try{!o&&i.return&&i.return()}finally{if(n)throw s}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),g=document.getElementById("canvas"),v=g.getContext("2d"),m={x:g.width/2,y:g.height/2},x=function(){g.width=g.clientWidth,g.height=g.clientHeight,m.x=0,m.y=0};window.addEventListener("resize",x),x();var b=void 0,E={ping:0,fps:0,players:1,projectiles:0};(b="8080"===window.location.port?io(window.location.hostname+":3000",{upgrade:!1,transports:["websocket"],query:""+new URL(window.location).searchParams}):io({upgrade:!1,transports:["websocket"],query:""+new URL(window.location).searchParams})).on("pong",function(e){E.ping=e});var S=function(e){var t=e.id,r=e.username;return{id:t,username:void 0===r?"":r,x:0,y:0,sx:0,sy:0}},O=function(e){return{id:e.id,x:e.x,y:e.y,sx:0,sy:0}},j={me:S("me"),others:new Map},A=new Map,L={width:0,height:0,holes:new Set,trees:new Set},B={pointer:m,players:j,projectiles:A,world:L},I=function(e,t,r){a(v,g.width,g.height),n()&&(v.save(),v.translate(g.width/2-e.players.me.x,g.height/2-e.players.me.y),h(v,e.world.holes),u(v,e.projectiles),c(v,e.players.others),i(v,e.world),v.restore(),d(v,g.width/2,g.height/2,r),v.save(),v.translate(g.width/2-e.players.me.x,g.height/2-e.players.me.y),l(v,e.world.trees),v.restore(),y(v,e.pointer.x+g.width/2,e.pointer.y+g.height/2),w(v,E))},k=0,C=0,X=function(e,t){var r=e.players,o=e.projectiles;r.me.x+=(r.me.sx-r.me.x)/5,r.me.y+=(r.me.sy-r.me.y)/5,r.others.forEach(function(e){e.x+=(e.sx-e.x)/5,e.y+=(e.sy-e.y)/5}),o.forEach(function(e){e.x+=(e.sx-e.x)/5,e.y+=(e.sy-e.y)/5}),k++,(C+=t)>1e3&&(E.fps=k/C*1e3|0,k=0,C=0),E.players=e.players.others.size+1,E.projectiles=e.projectiles.size},Y=0,M=!1,P=!0,T=function(e){M||(null===e.beta&&(g.classList.add("desktop"),P=!1,x()),M=!0)},R=void 0;window.addEventListener("deviceorientation",function(e){T(e),R||(R={beta:e.beta,gamma:e.gamma});var t=e.beta-R.beta,r=e.gamma-R.gamma;t>90&&(t=90),-90>t&&(t=-90),m.x=g.width/2*r/90*1.3,m.y=g.height/2*t/90*1.3,b.emit("c:pointer:update",m)}),g.addEventListener("mousemove",function(e){P||(m.x=e.clientX-g.offsetLeft-g.width/2,m.y=e.clientY-g.offsetTop-g.height/2,b.emit("c:pointer:update",m))}),document.addEventListener("mousedown",function(){P||b.emit("c:fire:pressed")}),document.addEventListener("touchstart",function(e){var t=e.touches[0],r=t.clientX,o=t.clientY;90>r&&90>o?R=null:b.emit("c:fire:pressed")}),b.on("s:players:update",function(t){var r=t.me,o=t.others;B.players.others=new Map([].concat(e(B.players.others)).filter(function(e){var t=p(e,1)[0];return null!=o.find(function(e){return e.id===t})})),o.forEach(function(e){var t=B.players.others.get(e.id);t||(t=S(e),B.players.others.set(e.id,t)),t.sx=e.x,t.sy=e.y}),B.players.me.sx=r.x,B.players.me.sy=r.y}),b.on("s:projectiles:update",function(t){B.projectiles=new Map([].concat(e(B.projectiles)).filter(function(e){var r=p(e,1)[0];return null!=t.find(function(e){return e.id===r})})),t.forEach(function(e){var t=B.projectiles.get(e.id);t||(t=O(e),B.projectiles.set(e.id,t)),t.sx=e.x,t.sy=e.y})}),b.on("s:world:create",function(e){var t=e.width,r=e.height,o=e.trees,n=e.holes;B.world.width=t,B.world.height=r,B.world.trees=new Set(o),B.world.holes=new Set(n)}),function e(t){requestAnimationFrame(e);var r=t-Y;X(B,r),I(B,0,t),Y=t}(0)}();
