(this["webpackJsonpchat-interactive-app"]=this["webpackJsonpchat-interactive-app"]||[]).push([[0],{27:function(e,t,n){},28:function(e,t,n){},34:function(e,t,n){"use strict";n.r(t);var s=n(1),a=n(0),o=n.n(a),c=n(15),i=n.n(c),r=(n(27),n(19)),l=(n(28),n(9)),u=n(2),d=n(16),p=n(17),h=n(21),j=n(20),b=function(e){Object(h.a)(n,e);var t=Object(j.a)(n);function n(e){var s;return Object(d.a)(this,n),(s=t.call(this,e)).connect=function(){var e=window.location.host,t="ws://".concat(e,"/chat"),n=new WebSocket(t);n.onopen=function(){console.log("websocket connected at ".concat(t)),s.setState({ws:n})},n.onclose=function(e){console.log("Socket is closed")},n.onmessage=function(e){var t=JSON.parse(e.data),n=s.state.usersMap;-1===t.x&&-1===t.y?n.delete(t.id):n.set(t.id,t),s.setState(n)},n.onerror=function(e){console.error("Socket encountered error: ",e.message,"Closing socket"),n.close()}},s.state={displayName:e.location.displayName,ws:null,x:0,y:0,usersMap:new Map},s}return Object(p.a)(n,[{key:"componentDidMount",value:function(){this.setState({displayName:this.state.displayName}),this.connect()}},{key:"componentWillUnmount",value:function(){this.setState({displayName:null}),null!=this.state.ws&&this.state.ws.close()}},{key:"_onMouseMove",value:function(e){var t=e.clientX,n=e.clientY;this.setState({x:t,y:n});var s=this.state.ws;if(null!=s&&1===s.readyState){var a={id:this.state.id,x:t,y:n,displayName:this.state.displayName},o=JSON.stringify(a);this.state.ws.send(o)}}},{key:"render",value:function(){var e=this.state.displayName;if(null==e||""===e)return Object(s.jsx)(u.a,{to:"/"});var t=this.state,n=t.x,a=t.y,o=t.usersMap;return Object(s.jsxs)("div",{className:"interactiveRoom",onMouseMove:this._onMouseMove.bind(this),style:{height:"100vh",width:"100%",padding:"0",margin:"0"},children:[Math.random()," ",e," ",n," ",a,Object(s.jsx)(v,{usersMap:o})]})}}]),n}(o.a.Component);function v(e){var t=e.usersMap;return 0===t.size?Object(s.jsx)("div",{}):Array.from(t.values()).map((function(e){var t={position:"absolute",top:"".concat(e.y,"px"),left:"".concat(e.x,"px"),fontSize:"30px",color:"red"};return Object(s.jsx)("div",{style:t,children:e.name},e.id)}))}function x(){var e=Object(a.useState)(""),t=Object(r.a)(e,2),n=t[0],o=t[1];return Object(s.jsx)("div",{className:"App",children:Object(s.jsxs)("div",{className:"joinSession",children:[Object(s.jsx)("input",{value:n,onChange:function(e){return o(e.target.value)},type:"text",placeholder:"Name",autoFocus:!0}),Object(s.jsx)("br",{})," ",Object(s.jsx)("br",{}),Object(s.jsx)(l.b,{to:{pathname:"/chatroom",displayName:n},style:{outline:"none",color:"white",textDecoration:"none",border:"solid",padding:"5px",borderRadius:"10px"},children:"Join Session"})]})})}var m=function(){return Object(s.jsx)(l.a,{children:Object(s.jsx)("div",{children:Object(s.jsxs)(u.d,{children:[Object(s.jsx)(u.b,{exact:!0,path:"/",children:Object(s.jsx)(x,{})}),Object(s.jsx)(u.b,{exact:!0,path:"/chatroom",component:b})]})})})};i.a.render(Object(s.jsx)(o.a.StrictMode,{children:Object(s.jsx)(m,{})}),document.getElementById("root"))}},[[34,1,2]]]);
//# sourceMappingURL=main.ad9343c5.chunk.js.map