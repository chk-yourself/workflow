(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,t,n){},102:function(e,t,n){},156:function(e,t,n){},159:function(e,t,n){},163:function(e,t,n){},166:function(e,t,n){},168:function(e,t,n){},170:function(e,t,n){},172:function(e,t,n){},174:function(e,t,n){},176:function(e,t,n){},178:function(e,t,n){},180:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"updateUserBoards",function(){return pe}),n.d(a,"getUserData",function(){return he}),n.d(a,"loadUserData",function(){return be});var r={};n.r(r),n.d(r,"getUserData",function(){return ve});var o={};n.r(o),n.d(o,"selectBoard",function(){return Ee}),n.d(o,"selectList",function(){return Ie}),n.d(o,"selectCard",function(){return Be});var c={};n.r(c),n.d(c,"getCurrentBoardId",function(){return Oe}),n.d(c,"getCurrentListId",function(){return je}),n.d(c,"getCurrentCardId",function(){return Ce}),n.d(c,"getCurrent",function(){return we});var s={};n.r(s),n.d(s,"loadBoardsById",function(){return Ae}),n.d(s,"fetchBoardsById",function(){return De}),n.d(s,"updateBoardsById",function(){return ke});var i={};n.r(i),n.d(i,"getBoardsById",function(){return Te}),n.d(i,"getBoardsArray",function(){return Ue});var u={};n.r(u),n.d(u,"loadListsById",function(){return Fe}),n.d(u,"fetchListsById",function(){return Pe}),n.d(u,"updateListsById",function(){return Me});var l={};n.r(l),n.d(l,"getListsById",function(){return We}),n.d(l,"getListsArray",function(){return Ye});var d={};n.r(d),n.d(d,"getCardsById",function(){return Ke}),n.d(d,"getCardsArray",function(){return Qe});var m={};n.r(m),n.d(m,"loadCardsById",function(){return Xe}),n.d(m,"fetchCardsById",function(){return $e}),n.d(m,"updateCardsById",function(){return Ge});var f=n(0),p=n.n(f),h=n(81),b=n.n(h),v=n(15),g=n(183),y=n(30),E=n(83),I=(n(100),n(4)),B=n(6),O=n(8),j=n(7),C=n(9),w=(n(102),n(184)),_=n(182),S=p.a.createContext(null),A=function(e){return function(t){return p.a.createElement(S.Consumer,null,function(n){return p.a.createElement(e,Object.assign({},t,{firebase:n}))})}},D=S,k=n(36),T=n.n(k),U={apiKey:"AIzaSyBEMtI6srASSV24HbRYSLjdV6eVTI248DQ",authDomain:"workflow-74f49.firebaseapp.com",databaseURL:"https://workflow-74f49.firebaseio.com",projectId:"workflow-74f49",storageBucket:"workflow-74f49.appspot.com",messagingSenderId:"417049317953"},L=function e(){var t=this;Object(I.a)(this,e),this.createUserWithEmailAndPassword=function(e,n){return t.auth.createUserWithEmailAndPassword(e,n)},this.signInWithEmailAndPassword=function(e,n){return t.auth.signInWithEmailAndPassword(e,n)},this.signOut=function(){return t.auth.signOut()},this.passwordReset=function(e){return t.auth.sendPasswordResetEmail(e)},this.passwordUpdate=function(e){return t.auth.currentUser.updatePassword(e)},this.addUser=function(e){var n=e.userId,a=e.name,r=e.username,o=e.email,c=e.boardIds,s=void 0===c?[]:c;return t.db.collection("users").doc(n).set({userId:n,name:a,username:r,email:o,boardIds:s})},this.updateUser=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return t.db.collection("users").doc(e).update(n)},this.updateBoard=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return t.db.collection("boards").doc(e).update(n)},this.updateList=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return t.db.collection("lists").doc(e).update(n)},this.updateCard=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return t.db.collection("cards").doc(e).update(n)},this.getUserDoc=function(e){return t.db.collection("users").doc(e)},this.getBoardDoc=function(e){return t.db.collection("boards").doc(e)},this.getTimestamp=function(){return T.a.firestore.FieldValue.serverTimestamp()},this.addToArray=function(e){return T.a.firestore.FieldValue.arrayUnion(e)},this.addBoard=function(e){var n=e.userId,a=e.boardTitle;t.db.collection("boards").add({title:a,createdAt:t.getTimestamp(),lastModifiedAt:t.getTimestamp(),listIds:[],authorId:n,memberIds:[n]}).then(function(e){t.updateUser(n,{boardIds:t.addToArray(e.id)})})},this.addList=function(e){var n=e.boardId,a=e.listTitle;t.db.collection("lists").add({title:a,createdAt:t.getTimestamp(),lastModifiedAt:t.getTimestamp(),cardIds:[],boardId:n}).then(function(e){t.updateBoard(n,{listIds:t.addToArray(e.id),lastModifiedAt:t.getTimestamp()})})},this.addCard=function(e){var n=e.boardId,a=e.listId,r=e.cardTitle;t.db.collection("cards").add({title:r,createdAt:t.getTimestamp(),lastModifiedAt:t.getTimestamp(),listId:a,boardId:n}).then(function(e){t.updateList(a,{cardIds:t.addToArray(e.id),lastModifiedAt:t.getTimestamp()})})},T.a.initializeApp(U),this.auth=T.a.auth(),this.db=T.a.firestore()},N=n(181),x="/home",R=A(function(e){var t=e.firebase;return p.a.createElement("button",{type:"button",onClick:t.signOut},"Sign Out")}),F=(n(156),p.a.createContext(null)),P=function(e){var t=function(t){function n(e){var t;return Object(I.a)(this,n),(t=Object(O.a)(this,Object(j.a)(n).call(this,e))).state={authUser:null},t}return Object(C.a)(n,t),Object(B.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.listener=this.props.firebase.auth.onAuthStateChanged(function(t){t?e.setState({authUser:t}):e.setState({authUser:null})})}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){return p.a.createElement(F.Provider,{value:this.state.authUser},p.a.createElement(e,this.props))}}]),n}(p.a.Component);return A(t)},M=n(185),W=n(35),Y=function(e){return function(t){var n=function(n){function a(e){return Object(I.a)(this,a),Object(O.a)(this,Object(j.a)(a).call(this,e))}return Object(C.a)(a,n),Object(B.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.listener=this.props.firebase.auth.onAuthStateChanged(function(n){e(n)||t.props.history.push("/signin")})}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){var n=this;return p.a.createElement(F.Consumer,null,function(a){return e(a)?p.a.createElement(t,n.props):null})}}]),a}(p.a.Component);return Object(W.a)(M.a,A)(n)}},q=function(){return p.a.createElement("ul",{className:"navlinks"},p.a.createElement("li",null,p.a.createElement(N.a,{to:x},"Home")),p.a.createElement("li",null,p.a.createElement(N.a,{to:"/account"},"Account")),p.a.createElement("li",null,p.a.createElement(N.a,{to:"/admin"},"Admin")),p.a.createElement("li",null,p.a.createElement(R,null)))},V=function(){return p.a.createElement("ul",{className:"navlinks"},p.a.createElement("li",null,p.a.createElement(N.a,{to:"/signin"},"Sign In")))},H=function(){return p.a.createElement("nav",{className:"navbar"},p.a.createElement("span",{className:"navbar__logo"},p.a.createElement(N.a,{to:"/"},"workflow")),p.a.createElement(F.Consumer,null,function(e){return e?p.a.createElement(q,null):p.a.createElement(V,null)}))},z=n(87),J=n(10),K=n(5),Q=(n(159),function(e){return p.a.createElement("div",{className:"input__group"},!e.hideLabel&&p.a.createElement("label",{htmlFor:e.name,className:"input__label"},e.title),p.a.createElement("input",{className:"input",id:e.name,name:e.name,type:e.type,value:e.value,onChange:e.onChange,placeholder:e.placeholder,required:e.isRequired}))}),X={username:"",name:"",email:"",passwordOne:"",passwordTwo:"",error:null},$=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(e){var t=n.state,a=t.username,r=t.email,o=t.name,c=t.passwordOne;n.props.firebase.createUserWithEmailAndPassword(r,c).then(function(e){var t=e.user.uid;return n.props.firebase.addUser({userId:t,name:o,username:a,email:r})}).then(function(e){n.setState(Object(K.a)({},X)),n.props.history.push(x)}).catch(function(e){n.setState({error:e})}),e.preventDefault()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.state=Object(K.a)({},X),n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.username,n=e.name,a=e.email,r=e.passwordOne,o=e.passwordTwo,c=e.error,s=""===r||""===o||""===a||""===t||r!==o;return p.a.createElement("form",{onSubmit:this.onSubmit},p.a.createElement(Q,{name:"name",title:"Full Name",value:n,onChange:this.onChange,type:"text"}),p.a.createElement(Q,{name:"username",title:"Username",value:t,onChange:this.onChange,type:"text"}),p.a.createElement(Q,{name:"email",title:"Email",value:a,onChange:this.onChange,type:"email"}),p.a.createElement(Q,{name:"passwordOne",title:"Password",value:r,onChange:this.onChange,type:"password"}),p.a.createElement(Q,{name:"passwordTwo",title:"Confirm Password",value:o,onChange:this.onChange,type:"password"}),p.a.createElement("button",{disabled:s,type:"submit"},"Sign Up"),c&&p.a.createElement("p",null,c.message))}}]),t}(f.Component),G=Object(W.a)(M.a,A)($),Z=function(){return p.a.createElement("main",{className:"app__main"},p.a.createElement("h1",null,"Sign Up"),p.a.createElement(G,null))},ee=function(){return p.a.createElement("p",null,"Don't have an account? ",p.a.createElement(N.a,{to:"/signup"},"Sign Up"))},te={email:"",password:"",error:null},ne=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(e){var t=n.state,a=t.email,r=t.password;n.props.firebase.signInWithEmailAndPassword(a,r).then(function(){n.setState(Object(K.a)({},te)),n.props.history.push(x)}).catch(function(e){n.setState({error:e})}),e.preventDefault()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.state=Object(K.a)({},te),n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.email,n=e.password,a=e.error,r=""===n||""===t;return p.a.createElement("form",{onSubmit:this.onSubmit},p.a.createElement(Q,{name:"email",title:"Email",value:t,onChange:this.onChange,type:"email"}),p.a.createElement(Q,{name:"password",title:"Password",value:n,onChange:this.onChange,type:"password"}),p.a.createElement("button",{disabled:r,type:"submit"},"Sign In"),a&&p.a.createElement("p",null,a.message))}}]),t}(f.Component),ae=Object(W.a)(M.a,A)(ne),re={email:"",error:null},oe=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(e){var t=n.state.email;n.props.firebase.passwordReset(t).then(function(){n.setState(Object(K.a)({},re))}).catch(function(e){n.setState({error:e})}),e.preventDefault()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.state=Object(K.a)({},re),n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.email,n=e.error,a=""===t;return p.a.createElement("form",{onSubmit:this.onSubmit},p.a.createElement(Q,{name:"email",title:"Email",value:t,onChange:this.onChange,type:"email"}),p.a.createElement("button",{disabled:a,type:"submit"},"Reset My Password"),n&&p.a.createElement("p",null,n.message))}}]),t}(f.Component),ce=A(oe),se=function(){return p.a.createElement("main",{className:"app__main"},p.a.createElement("h1",null,"Forgot your password?"),p.a.createElement(ce,null))},ie=function(){return p.a.createElement("p",null,p.a.createElement(N.a,{to:"/pw-forget"},"Forgot Password?"))},ue=function(){return p.a.createElement("main",{className:"app__main"},p.a.createElement("h1",null,"Sign In"),p.a.createElement(ae,null),p.a.createElement(ie,null),p.a.createElement(ee,null))},le=n(17),de=n.n(le),me=n(23),fe=new L,pe=function(e){return{type:"ADD_USER_BOARD",boardIds:e}},he=function(e){return function(){var t=Object(me.a)(de.a.mark(function t(n){var a;return de.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fe.getUserDoc(e).get().then(function(e){return e.data()});case 3:a=t.sent,n(be(a)),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}},t,this,[[0,7]])}));return function(e){return t.apply(this,arguments)}}()},be=function(e){return{type:"LOAD_USER_DATA",user:e}},ve=function(e){return e.user},ge=n(90),ye=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_USER_BOARD":return Object(K.a)({},e,{boardIds:Object(ge.a)(t.boardIds)});case"LOAD_USER_DATA":return Object(K.a)({},e,t.user);default:return e}},Ee=function(e){return{type:"SELECT_BOARD",boardId:e}},Ie=function(e){return{type:"SELECT_LIST",listId:e}},Be=function(e){return{types:"SELECT_CARD",cardId:e}},Oe=function(e){return e.current.boardId},je=function(e){return e.current.listId},Ce=function(e){return e.current.cardId},we=function(e){return e.current},_e=function(e){function t(){return Object(I.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){return p.a.createElement("ul",{className:"board-grid"},this.props.children)}}]),t}(f.Component),Se=function(e){return p.a.createElement("li",{className:"board-grid__tile"},p.a.createElement(N.a,{className:"board-grid__link",to:"/home/board/".concat(e.boardId),onClick:e.onClick},p.a.createElement("span",{className:"board-grid__title"},e.title)))},Ae=(n(163),function(e){return{type:"LOAD_BOARDS_BY_ID",boardsById:e}}),De=function(e){return function(){var t=Object(me.a)(de.a.mark(function t(n){var a;return de.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fe.db.collection("boards").where("memberIds","array-contains",e).get().then(function(e){var t={};return e.forEach(function(e){t[e.id]=e.data()}),t});case 3:a=t.sent,n(Ae(a)),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}},t,this,[[0,7]])}));return function(e){return t.apply(this,arguments)}}()},ke=function(e){return{type:"UPDATE_BOARDS_BY_ID",board:e}},Te=function(e){return e.boardsById},Ue=function(e){var t=e.boardsById;return Object.keys(t).map(function(e){return Object(K.a)({boardId:e},t[e])})},Le=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOAD_BOARDS_BY_ID":var n=t.boardsById;return Object(K.a)({},e,n);case"UPDATE_BOARDS_BY_ID":var a=t.board;return Object(K.a)({},e,a);default:return e}},Ne=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).state={},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.user.userId;this.props.fetchBoardsById(t),this.listener=this.props.firebase.db.collection("boards").where("memberIds","array-contains",t).onSnapshot(function(t){t.docChanges().forEach(function(t){var n=Object(J.a)({},t.doc.id,t.doc.data());e.props.updateBoardsById(n)})})}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){var e=this.props.user,t=(e.boardIds,e.userId,this.props),n=t.boardsArray,a=t.selectBoard,r=n.map(function(e){var t=e.title,n=e.boardId;return p.a.createElement(Se,{key:n,title:t,boardId:n,onClick:function(){return a(n)}})});return p.a.createElement("section",null,p.a.createElement(_e,null,r,p.a.createElement("button",{type:"button",className:"board-grid__tile board-grid__btn--add",onClick:this.props.openBoardComposer},"Create new board...")))}}]),t}(f.Component),xe=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),boardsById:i.getBoardsById(e),boardsArray:i.getBoardsArray(e)}},function(e){return{getUserData:function(t){return e(a.getUserData(t))},updateUserBoards:function(t){return e(a.updateUserBoards(t))},fetchBoardsById:function(t){return e(s.fetchBoardsById(t))},updateBoardsById:function(t){return e(s.updateBoardsById(t))},selectBoard:function(t){return e(o.selectBoard(t))}}})(Ne)),Re=function(e){return p.a.createElement("div",{className:"board"},e.children)},Fe=function(e){return{type:"LOAD_LISTS_BY_ID",listsById:e}},Pe=function(e){return function(){var t=Object(me.a)(de.a.mark(function t(n){var a;return de.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fe.db.collection("lists").where("boardId","==",e).get().then(function(e){var t={};return e.forEach(function(e){t[e.id]=e.data()}),t});case 3:a=t.sent,n(Fe(a)),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}},t,this,[[0,7]])}));return function(e){return t.apply(this,arguments)}}()},Me=function(e){return{type:"UPDATE_LISTS_BY_ID",list:e}},We=function(e){return e.listsById},Ye=function(e){var t=e.listsById;return Object.keys(t).map(function(e){return Object(K.a)({listId:e},t[e])})},qe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOAD_LISTS_BY_ID":return Object(K.a)({},e,t.listsById);case"UPDATE_LISTS_BY_ID":return Object(K.a)({},e,t.list);default:return e}},Ve=(n(80),n(166),n(88)),He=n.n(Ve);var ze=function(e){return p.a.createElement("svg",{className:"feather feather-".concat(e.name," ").concat(e.addClass||"").trim(),xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24",width:"24",height:"24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},p.a.createElement("use",{xlinkHref:"".concat(He.a,"#").concat(e.name)}))},Je=function(e){function t(){return Object(I.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){return p.a.createElement("div",{className:"card",onClick:this.props.onClick},p.a.createElement("div",{className:"card__header"},p.a.createElement("button",{className:"card__btn--more-actions",type:"button"},p.a.createElement(ze,{name:"more-horizontal"})),p.a.createElement("div",{className:"card__tags"}),p.a.createElement("h3",{className:"card__title"},this.props.title)),p.a.createElement("div",{className:"card__footer"},p.a.createElement("div",{className:"card__labels"})))}}]),t}(f.Component),Ke=function(e){return e.cardsById},Qe=function(e){var t=e.cardsById;return Object.keys(t).map(function(e){return Object(K.a)({cardId:e},t[e])})},Xe=function(e){return{type:"LOAD_CARDS_BY_ID",cardsById:e}},$e=function(e){return function(){var t=Object(me.a)(de.a.mark(function t(n){var a;return de.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fe.db.collection("cards").where("boardId","==",e).get().then(function(e){var t={};return e.forEach(function(e){t[e.id]=e.data()}),t});case 3:a=t.sent,n(Xe(a)),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}},t,this,[[0,7]])}));return function(e){return t.apply(this,arguments)}}()},Ge=function(e){return{type:"UPDATE_CARDS_BY_ID",card:e}},Ze=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOAD_CARDS_BY_ID":var n=t.cardsById;return Object(K.a)({},e,n);case"UPDATE_CARDS_BY_ID":var a=t.card;return Object(K.a)({},e,a);default:return e}},et=(n(168),function(e){return p.a.createElement("textarea",{className:"textarea ".concat(e.style),id:e.name,name:e.name,value:e.value,onChange:e.onChange,placeholder:e.placeholder,required:e.isRequired})}),tt=(n(170),function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).resetForm=function(){n.setState({cardTitle:""})},n.onSubmit=function(e){e.preventDefault();var t=n.state.cardTitle,a=n.props.current.boardId,r=n.props.listId;n.props.firebase.addCard({boardId:a,listId:r,cardTitle:t}),n.resetForm()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.onFocus=function(e){n.setState({isActive:!0})},n.onBlur=function(e){""===e.target.value&&n.setState({isActive:!1})},n.state={cardTitle:"",isActive:!1},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.cardTitle,n=e.isActive;return p.a.createElement("div",{className:"card-composer".concat(n?" is-active":""),onFocus:this.onFocus,onBlur:this.onBlur},p.a.createElement("form",{className:"card-composer__form",onSubmit:this.onSubmit},p.a.createElement(et,{onChange:this.onChange,value:t,placeholder:n?"Enter card title...":"Add a card",isRequired:!0,name:"cardTitle",style:"card"}),n&&p.a.createElement(p.a.Fragment,null,p.a.createElement("button",{className:"card-composer__btn--add",type:"submit"},"Add Card"),p.a.createElement("button",{className:"card-composer__btn--close",type:"button"},p.a.createElement(ze,{name:"x"})))))}}]),t}(f.Component)),nt=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),boardsById:i.getBoardsById(e),boardsArray:i.getBoardsArray(e),current:c.getCurrent(e)}},function(e){return{updateBoardsById:function(t){return e(s.updateBoardsById(t))}}})(tt)),at=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).state={},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){return p.a.createElement("section",{className:"list"},p.a.createElement("header",{className:"list__header"},p.a.createElement("h2",{className:"list__title"},this.props.title)),p.a.createElement("div",{className:"list__content"},this.props.children))}}]),t}(f.Component),rt=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).resetForm=function(){n.setState({listTitle:""})},n.onSubmit=function(e){e.preventDefault();var t=n.state.listTitle,a=n.props.current.boardId;n.props.firebase.addList({boardId:a,listTitle:t}),n.resetForm()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.onFocus=function(e){n.setState({isActive:!0})},n.onBlur=function(e){""===e.target.value&&n.setState({isActive:!1})},n.state={listTitle:"",isActive:!1},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.listTitle,n=e.isActive;return p.a.createElement("div",{className:"list-composer".concat(n?" is-active":""),onFocus:this.onFocus,onBlur:this.onBlur},p.a.createElement("form",{className:"list-composer__form",onSubmit:this.onSubmit},p.a.createElement(Q,{onChange:this.onChange,value:t,placeholder:n?"Enter list title...":"Add a list",required:"true",name:"listTitle",hideLabel:"true"}),n&&p.a.createElement(p.a.Fragment,null,p.a.createElement("button",{className:"list-composer__btn--add",type:"submit"},"Add List"),p.a.createElement("button",{className:"list-composer__btn--close",type:"button"},p.a.createElement(ze,{name:"x"})))))}}]),t}(f.Component),ot=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),boardsById:i.getBoardsById(e),boardsArray:i.getBoardsArray(e),current:c.getCurrent(e)}},function(e){return{getUserData:function(t){return e(a.getUserData(t))},fetchBoardsById:function(t){return e(s.fetchBoardsById(t))},updateBoardsById:function(t){return e(s.updateBoardsById(t))},selectBoard:function(t){return e(o.selectBoard(t))}}})(rt)),ct=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).state={isFetching:!0},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.current,n=t.boardId;t.listId,t.cardId;this.props.fetchCardsById(n).then(function(){e.setState({isFetching:!1})}),this.listener=this.props.firebase.db.collection("cards").where("boardId","==",n).onSnapshot(function(t){t.docChanges().forEach(function(t){var n=Object(J.a)({},t.doc.id,t.doc.data());e.props.updateCardsById(n)})}),console.log("mounted")}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){if(this.state.isFetching)return null;var e=this.props,t=e.cardIds,n=e.cardsById,a=e.listId,r=e.title,o=t.map(function(e){var t=n[e].title;return p.a.createElement(Je,{key:e,title:t})});return p.a.createElement(at,{title:r},o,p.a.createElement(nt,{listId:a}))}}]),t}(f.Component),st=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),current:c.getCurrent(e),listsById:l.getListsById(e),listsArray:l.getListsArray(e),cardsById:d.getCardsById(e)}},function(e){return{getUserData:function(t){return e(a.getUserData(t))},fetchBoardsById:function(t){return e(s.fetchBoardsById(t))},updateBoardsById:function(t){return e(s.updateBoardsById(t))},selectBoard:function(t){return e(o.selectBoard(t))},fetchListsById:function(t){return e(u.fetchListsById(t))},updateListsById:function(t){return e(u.updateListsById(t))},fetchCardsById:function(t){return e(m.fetchCardsById(t))},updateCardsById:function(t){return e(m.updateCardsById(t))}}})(ct)),it=(n(172),function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).state={},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.current.boardId;this.props.fetchListsById(t),this.listener=this.props.firebase.db.collection("lists").where("boardId","==",t).onSnapshot(function(t){t.docChanges().forEach(function(t){var n=Object(J.a)({},t.doc.id,t.doc.data());e.props.updateListsById(n)})}),console.log("mounted")}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){var e=this.props.current.boardId,t=this.props,n=t.boardsById,a=t.listsArray,r=n[e].title,o=a.map(function(e){var t=e.listId,n=e.title,a=e.cardIds;return p.a.createElement(st,{listId:t,key:t,title:n,cardIds:a})});return p.a.createElement("main",{className:"board-container"},p.a.createElement("h1",null,r),p.a.createElement(Re,null,o,p.a.createElement(ot,null)))}}]),t}(f.Component)),ut=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),boardsById:i.getBoardsById(e),current:c.getCurrent(e),listsById:l.getListsById(e),listsArray:l.getListsArray(e)}},function(e){return{getUserData:function(t){return e(a.getUserData(t))},fetchBoardsById:function(t){return e(s.fetchBoardsById(t))},updateBoardsById:function(t){return e(s.updateBoardsById(t))},selectBoard:function(t){return e(o.selectBoard(t))},fetchListsById:function(t){return e(u.fetchListsById(t))},updateListsById:function(t){return e(u.updateListsById(t))}}})(it)),lt=(n(174),function(e){var t=e.onModalClose,n=e.children;return p.a.createElement("div",{className:"modal"},p.a.createElement("div",{className:"modal__content"},p.a.createElement("button",{type:"button",className:"modal__btn--close",onClick:t},p.a.createElement(ze,{name:"x"})),n))}),dt={boardTitle:""},mt=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(e){e.preventDefault();var t=n.state.boardTitle,a=n.props;a.handleSubmit,a.onClose;n.props.handleSubmit(t),n.props.onClose(),n.setState(Object(K.a)({},dt))},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.state=Object(K.a)({},dt),n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state.boardTitle;return p.a.createElement(lt,{onModalClose:this.props.onClose},p.a.createElement("form",{onSubmit:this.onSubmit},p.a.createElement(Q,{name:"boardTitle",title:"Board Title",value:e,onChange:this.onChange,type:"text"}),p.a.createElement("button",{type:"submit"},"Create Board")))}}]),t}(f.Component),ft=(n(176),function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).toggleBoardComposer=function(){n.setState(function(e){return{showCreateBoardForm:!e.showCreateBoardForm}})},n.createBoard=function(e){var t=n.props.user.userId;n.props.firebase.addBoard({userId:t,boardTitle:e})},n.state={showCreateBoardForm:!1},n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.firebase.auth.currentUser.uid;this.props.getUserData(e)}},{key:"render",value:function(){var e=this,t=this.state.showCreateBoardForm,n=this.props.user.userId;return p.a.createElement(p.a.Fragment,null,t&&p.a.createElement(mt,{onClose:this.toggleBoardComposer,handleSubmit:this.createBoard}),p.a.createElement(w.a,null,p.a.createElement(_.a,{exact:!0,path:x,render:function(){return p.a.createElement("main",{className:"main"},p.a.createElement("h1",null,"Home"),n&&p.a.createElement(xe,{openBoardComposer:e.toggleBoardComposer}))}}),p.a.createElement(_.a,{path:"/home/board/:id",render:function(e){return p.a.createElement(ut,e)}})))}}]),t}(f.Component)),pt=Y(function(e){return!!e})(Object(v.b)(function(e){return{user:r.getUserData(e),currentBoardId:c.getCurrentBoardId(e)}},function(e){return{getUserData:function(t){return e(a.getUserData(t))}}})(ft)),ht={passwordOne:"",passwordTwo:"",error:null},bt=function(e){function t(e){var n;return Object(I.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(e){var t=n.state.passwordOne;n.props.firebase.passwordUpdate(t).then(function(){n.setState(Object(K.a)({},ht))}).catch(function(e){n.setState({error:e})}),e.preventDefault()},n.onChange=function(e){n.setState(Object(J.a)({},e.target.name,e.target.value))},n.state=Object(K.a)({},ht),n}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){var e=this.state,t=e.passwordOne,n=e.passwordTwo,a=e.error,r=""===t||t!==n;return p.a.createElement("form",{onSubmit:this.onSubmit},p.a.createElement(Q,{name:"passwordOne",title:"New Password",value:t,onChange:this.onChange,type:"password"}),p.a.createElement(Q,{name:"passwordTwo",title:"Confirm New Password",value:n,onChange:this.onChange,type:"password"}),p.a.createElement("button",{disabled:r,type:"submit"},"Reset My Password"),a&&p.a.createElement("p",null,a.message))}}]),t}(f.Component),vt=A(bt),gt=Y(function(e){return!!e})(function(){return p.a.createElement(F.Consumer,null,function(e){return p.a.createElement("div",null,p.a.createElement("h1",null,"Account: ",e.email),p.a.createElement(ce,null),p.a.createElement(vt,null))})}),yt=n(89),Et=(n(178),function(e){function t(){return Object(I.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){return p.a.createElement("header",{className:"header"},p.a.createElement(H,null))}}]),t}(f.Component)),It=P(function(e){function t(){return Object(I.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(C.a)(t,e),Object(B.a)(t,[{key:"render",value:function(){return p.a.createElement("div",{className:"app"},p.a.createElement(Et,null),p.a.createElement(w.a,null,p.a.createElement(_.a,{exact:!0,path:"/",component:z.LandingPage}),p.a.createElement(_.a,{path:"/signup",component:Z}),p.a.createElement(_.a,{path:"/signin",component:ue}),p.a.createElement(_.a,{path:"/pw-forget",component:se}),p.a.createElement(_.a,{path:x,component:pt}),p.a.createElement(_.a,{path:"/account",component:gt}),p.a.createElement(_.a,{path:"/admin",component:yt.AdminPage})))}}]),t}(f.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Bt=Object(y.c)({boardsById:Le,cardsById:Ze,listsById:qe,user:ye,current:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SELECT_BOARD":var n=t.boardId;return Object(K.a)({},e,{boardId:n});case"SELECT_LIST":var a=t.listId;return Object(K.a)({},e,{listId:a});case"SELECT_CARD":var r=t.cardId;return Object(K.a)({},e,{cardId:r});default:return e}}}),Ot=n(50),jt=Object(Ot.a)({basename:"/workflow"}),Ct=Object(y.d)(Bt,{},Object(y.a)(E.a));b.a.render(p.a.createElement(v.a,{store:Ct},p.a.createElement(D.Provider,{value:fe},p.a.createElement(g.a,{basename:"/workflow",history:jt},p.a.createElement(It,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},80:function(e,t,n){},87:function(e,t){},88:function(e,t,n){e.exports=n.p+"static/media/feather-sprite.0ed672ce.svg"},89:function(e,t){},91:function(e,t,n){e.exports=n(180)}},[[91,2,1]]]);
//# sourceMappingURL=main.93262f5e.chunk.js.map