(function(){const O=document.createElement("link").relList;if(O&&O.supports&&O.supports("modulepreload"))return;for(const R of document.querySelectorAll('link[rel="modulepreload"]'))p(R);new MutationObserver(R=>{for(const H of R)if(H.type==="childList")for(const k of H.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&p(k)}).observe(document,{childList:!0,subtree:!0});function C(R){const H={};return R.integrity&&(H.integrity=R.integrity),R.referrerPolicy&&(H.referrerPolicy=R.referrerPolicy),R.crossOrigin==="use-credentials"?H.credentials="include":R.crossOrigin==="anonymous"?H.credentials="omit":H.credentials="same-origin",H}function p(R){if(R.ep)return;R.ep=!0;const H=C(R);fetch(R.href,H)}})();function Dd(x){return x&&x.__esModule&&Object.prototype.hasOwnProperty.call(x,"default")?x.default:x}var ur={exports:{}},Sn={};var vd;function nh(){if(vd)return Sn;vd=1;var x=Symbol.for("react.transitional.element"),O=Symbol.for("react.fragment");function C(p,R,H){var k=null;if(H!==void 0&&(k=""+H),R.key!==void 0&&(k=""+R.key),"key"in R){H={};for(var ht in R)ht!=="key"&&(H[ht]=R[ht])}else H=R;return R=H.ref,{$$typeof:x,type:p,key:k,ref:R!==void 0?R:null,props:H}}return Sn.Fragment=O,Sn.jsx=C,Sn.jsxs=C,Sn}var yd;function ih(){return yd||(yd=1,ur.exports=nh()),ur.exports}var r=ih(),cr={exports:{}},L={};var bd;function uh(){if(bd)return L;bd=1;var x=Symbol.for("react.transitional.element"),O=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),p=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),H=Symbol.for("react.consumer"),k=Symbol.for("react.context"),ht=Symbol.for("react.forward_ref"),A=Symbol.for("react.suspense"),S=Symbol.for("react.memo"),J=Symbol.for("react.lazy"),U=Symbol.for("react.activity"),dt=Symbol.iterator;function Yt(s){return s===null||typeof s!="object"?null:(s=dt&&s[dt]||s["@@iterator"],typeof s=="function"?s:null)}var Q={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},lt=Object.assign,ra={};function Lt(s,T,j){this.props=s,this.context=T,this.refs=ra,this.updater=j||Q}Lt.prototype.isReactComponent={},Lt.prototype.setState=function(s,T){if(typeof s!="object"&&typeof s!="function"&&s!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,s,T,"setState")},Lt.prototype.forceUpdate=function(s){this.updater.enqueueForceUpdate(this,s,"forceUpdate")};function Wa(){}Wa.prototype=Lt.prototype;function Bt(s,T,j){this.props=s,this.context=T,this.refs=ra,this.updater=j||Q}var fa=Bt.prototype=new Wa;fa.constructor=Bt,lt(fa,Lt.prototype),fa.isPureReactComponent=!0;var Ta=Array.isArray;function Xt(){}var $={H:null,A:null,T:null,S:null},Qt=Object.prototype.hasOwnProperty;function Aa(s,T,j){var w=j.ref;return{$$typeof:x,type:s,key:T,ref:w!==void 0?w:null,props:j}}function Xe(s,T){return Aa(s.type,T,s.props)}function Na(s){return typeof s=="object"&&s!==null&&s.$$typeof===x}function Zt(s){var T={"=":"=0",":":"=2"};return"$"+s.replace(/[=:]/g,function(j){return T[j]})}var ze=/\/+/g;function _a(s,T){return typeof s=="object"&&s!==null&&s.key!=null?Zt(""+s.key):T.toString(36)}function ba(s){switch(s.status){case"fulfilled":return s.value;case"rejected":throw s.reason;default:switch(typeof s.status=="string"?s.then(Xt,Xt):(s.status="pending",s.then(function(T){s.status==="pending"&&(s.status="fulfilled",s.value=T)},function(T){s.status==="pending"&&(s.status="rejected",s.reason=T)})),s.status){case"fulfilled":return s.value;case"rejected":throw s.reason}}throw s}function b(s,T,j,w,q){var Z=typeof s;(Z==="undefined"||Z==="boolean")&&(s=null);var et=!1;if(s===null)et=!0;else switch(Z){case"bigint":case"string":case"number":et=!0;break;case"object":switch(s.$$typeof){case x:case O:et=!0;break;case J:return et=s._init,b(et(s._payload),T,j,w,q)}}if(et)return q=q(s),et=w===""?"."+_a(s,0):w,Ta(q)?(j="",et!=null&&(j=et.replace(ze,"$&/")+"/"),b(q,T,j,"",function(jl){return jl})):q!=null&&(Na(q)&&(q=Xe(q,j+(q.key==null||s&&s.key===q.key?"":(""+q.key).replace(ze,"$&/")+"/")+et)),T.push(q)),1;et=0;var qt=w===""?".":w+":";if(Ta(s))for(var bt=0;bt<s.length;bt++)w=s[bt],Z=qt+_a(w,bt),et+=b(w,T,j,Z,q);else if(bt=Yt(s),typeof bt=="function")for(s=bt.call(s),bt=0;!(w=s.next()).done;)w=w.value,Z=qt+_a(w,bt++),et+=b(w,T,j,Z,q);else if(Z==="object"){if(typeof s.then=="function")return b(ba(s),T,j,w,q);throw T=String(s),Error("Objects are not valid as a React child (found: "+(T==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":T)+"). If you meant to render a collection of children, use an array instead.")}return et}function N(s,T,j){if(s==null)return s;var w=[],q=0;return b(s,w,"","",function(Z){return T.call(j,Z,q++)}),w}function Y(s){if(s._status===-1){var T=s._result;T=T(),T.then(function(j){(s._status===0||s._status===-1)&&(s._status=1,s._result=j)},function(j){(s._status===0||s._status===-1)&&(s._status=2,s._result=j)}),s._status===-1&&(s._status=0,s._result=T)}if(s._status===1)return s._result.default;throw s._result}var ut=typeof reportError=="function"?reportError:function(s){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var T=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof s=="object"&&s!==null&&typeof s.message=="string"?String(s.message):String(s),error:s});if(!window.dispatchEvent(T))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",s);return}console.error(s)},ot={map:N,forEach:function(s,T,j){N(s,function(){T.apply(this,arguments)},j)},count:function(s){var T=0;return N(s,function(){T++}),T},toArray:function(s){return N(s,function(T){return T})||[]},only:function(s){if(!Na(s))throw Error("React.Children.only expected to receive a single React element child.");return s}};return L.Activity=U,L.Children=ot,L.Component=Lt,L.Fragment=C,L.Profiler=R,L.PureComponent=Bt,L.StrictMode=p,L.Suspense=A,L.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=$,L.__COMPILER_RUNTIME={__proto__:null,c:function(s){return $.H.useMemoCache(s)}},L.cache=function(s){return function(){return s.apply(null,arguments)}},L.cacheSignal=function(){return null},L.cloneElement=function(s,T,j){if(s==null)throw Error("The argument must be a React element, but you passed "+s+".");var w=lt({},s.props),q=s.key;if(T!=null)for(Z in T.key!==void 0&&(q=""+T.key),T)!Qt.call(T,Z)||Z==="key"||Z==="__self"||Z==="__source"||Z==="ref"&&T.ref===void 0||(w[Z]=T[Z]);var Z=arguments.length-2;if(Z===1)w.children=j;else if(1<Z){for(var et=Array(Z),qt=0;qt<Z;qt++)et[qt]=arguments[qt+2];w.children=et}return Aa(s.type,q,w)},L.createContext=function(s){return s={$$typeof:k,_currentValue:s,_currentValue2:s,_threadCount:0,Provider:null,Consumer:null},s.Provider=s,s.Consumer={$$typeof:H,_context:s},s},L.createElement=function(s,T,j){var w,q={},Z=null;if(T!=null)for(w in T.key!==void 0&&(Z=""+T.key),T)Qt.call(T,w)&&w!=="key"&&w!=="__self"&&w!=="__source"&&(q[w]=T[w]);var et=arguments.length-2;if(et===1)q.children=j;else if(1<et){for(var qt=Array(et),bt=0;bt<et;bt++)qt[bt]=arguments[bt+2];q.children=qt}if(s&&s.defaultProps)for(w in et=s.defaultProps,et)q[w]===void 0&&(q[w]=et[w]);return Aa(s,Z,q)},L.createRef=function(){return{current:null}},L.forwardRef=function(s){return{$$typeof:ht,render:s}},L.isValidElement=Na,L.lazy=function(s){return{$$typeof:J,_payload:{_status:-1,_result:s},_init:Y}},L.memo=function(s,T){return{$$typeof:S,type:s,compare:T===void 0?null:T}},L.startTransition=function(s){var T=$.T,j={};$.T=j;try{var w=s(),q=$.S;q!==null&&q(j,w),typeof w=="object"&&w!==null&&typeof w.then=="function"&&w.then(Xt,ut)}catch(Z){ut(Z)}finally{T!==null&&j.types!==null&&(T.types=j.types),$.T=T}},L.unstable_useCacheRefresh=function(){return $.H.useCacheRefresh()},L.use=function(s){return $.H.use(s)},L.useActionState=function(s,T,j){return $.H.useActionState(s,T,j)},L.useCallback=function(s,T){return $.H.useCallback(s,T)},L.useContext=function(s){return $.H.useContext(s)},L.useDebugValue=function(){},L.useDeferredValue=function(s,T){return $.H.useDeferredValue(s,T)},L.useEffect=function(s,T){return $.H.useEffect(s,T)},L.useEffectEvent=function(s){return $.H.useEffectEvent(s)},L.useId=function(){return $.H.useId()},L.useImperativeHandle=function(s,T,j){return $.H.useImperativeHandle(s,T,j)},L.useInsertionEffect=function(s,T){return $.H.useInsertionEffect(s,T)},L.useLayoutEffect=function(s,T){return $.H.useLayoutEffect(s,T)},L.useMemo=function(s,T){return $.H.useMemo(s,T)},L.useOptimistic=function(s,T){return $.H.useOptimistic(s,T)},L.useReducer=function(s,T,j){return $.H.useReducer(s,T,j)},L.useRef=function(s){return $.H.useRef(s)},L.useState=function(s){return $.H.useState(s)},L.useSyncExternalStore=function(s,T,j){return $.H.useSyncExternalStore(s,T,j)},L.useTransition=function(){return $.H.useTransition()},L.version="19.2.1",L}var Sd;function gr(){return Sd||(Sd=1,cr.exports=uh()),cr.exports}var xt=gr();const ch=Dd(xt);var rr={exports:{}},zn={},fr={exports:{}},or={};var zd;function rh(){return zd||(zd=1,(function(x){function O(b,N){var Y=b.length;b.push(N);t:for(;0<Y;){var ut=Y-1>>>1,ot=b[ut];if(0<R(ot,N))b[ut]=N,b[Y]=ot,Y=ut;else break t}}function C(b){return b.length===0?null:b[0]}function p(b){if(b.length===0)return null;var N=b[0],Y=b.pop();if(Y!==N){b[0]=Y;t:for(var ut=0,ot=b.length,s=ot>>>1;ut<s;){var T=2*(ut+1)-1,j=b[T],w=T+1,q=b[w];if(0>R(j,Y))w<ot&&0>R(q,j)?(b[ut]=q,b[w]=Y,ut=w):(b[ut]=j,b[T]=Y,ut=T);else if(w<ot&&0>R(q,Y))b[ut]=q,b[w]=Y,ut=w;else break t}}return N}function R(b,N){var Y=b.sortIndex-N.sortIndex;return Y!==0?Y:b.id-N.id}if(x.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var H=performance;x.unstable_now=function(){return H.now()}}else{var k=Date,ht=k.now();x.unstable_now=function(){return k.now()-ht}}var A=[],S=[],J=1,U=null,dt=3,Yt=!1,Q=!1,lt=!1,ra=!1,Lt=typeof setTimeout=="function"?setTimeout:null,Wa=typeof clearTimeout=="function"?clearTimeout:null,Bt=typeof setImmediate<"u"?setImmediate:null;function fa(b){for(var N=C(S);N!==null;){if(N.callback===null)p(S);else if(N.startTime<=b)p(S),N.sortIndex=N.expirationTime,O(A,N);else break;N=C(S)}}function Ta(b){if(lt=!1,fa(b),!Q)if(C(A)!==null)Q=!0,Xt||(Xt=!0,Zt());else{var N=C(S);N!==null&&ba(Ta,N.startTime-b)}}var Xt=!1,$=-1,Qt=5,Aa=-1;function Xe(){return ra?!0:!(x.unstable_now()-Aa<Qt)}function Na(){if(ra=!1,Xt){var b=x.unstable_now();Aa=b;var N=!0;try{t:{Q=!1,lt&&(lt=!1,Wa($),$=-1),Yt=!0;var Y=dt;try{a:{for(fa(b),U=C(A);U!==null&&!(U.expirationTime>b&&Xe());){var ut=U.callback;if(typeof ut=="function"){U.callback=null,dt=U.priorityLevel;var ot=ut(U.expirationTime<=b);if(b=x.unstable_now(),typeof ot=="function"){U.callback=ot,fa(b),N=!0;break a}U===C(A)&&p(A),fa(b)}else p(A);U=C(A)}if(U!==null)N=!0;else{var s=C(S);s!==null&&ba(Ta,s.startTime-b),N=!1}}break t}finally{U=null,dt=Y,Yt=!1}N=void 0}}finally{N?Zt():Xt=!1}}}var Zt;if(typeof Bt=="function")Zt=function(){Bt(Na)};else if(typeof MessageChannel<"u"){var ze=new MessageChannel,_a=ze.port2;ze.port1.onmessage=Na,Zt=function(){_a.postMessage(null)}}else Zt=function(){Lt(Na,0)};function ba(b,N){$=Lt(function(){b(x.unstable_now())},N)}x.unstable_IdlePriority=5,x.unstable_ImmediatePriority=1,x.unstable_LowPriority=4,x.unstable_NormalPriority=3,x.unstable_Profiling=null,x.unstable_UserBlockingPriority=2,x.unstable_cancelCallback=function(b){b.callback=null},x.unstable_forceFrameRate=function(b){0>b||125<b?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Qt=0<b?Math.floor(1e3/b):5},x.unstable_getCurrentPriorityLevel=function(){return dt},x.unstable_next=function(b){switch(dt){case 1:case 2:case 3:var N=3;break;default:N=dt}var Y=dt;dt=N;try{return b()}finally{dt=Y}},x.unstable_requestPaint=function(){ra=!0},x.unstable_runWithPriority=function(b,N){switch(b){case 1:case 2:case 3:case 4:case 5:break;default:b=3}var Y=dt;dt=b;try{return N()}finally{dt=Y}},x.unstable_scheduleCallback=function(b,N,Y){var ut=x.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?ut+Y:ut):Y=ut,b){case 1:var ot=-1;break;case 2:ot=250;break;case 5:ot=1073741823;break;case 4:ot=1e4;break;default:ot=5e3}return ot=Y+ot,b={id:J++,callback:N,priorityLevel:b,startTime:Y,expirationTime:ot,sortIndex:-1},Y>ut?(b.sortIndex=Y,O(S,b),C(A)===null&&b===C(S)&&(lt?(Wa($),$=-1):lt=!0,ba(Ta,Y-ut))):(b.sortIndex=ot,O(A,b),Q||Yt||(Q=!0,Xt||(Xt=!0,Zt()))),b},x.unstable_shouldYield=Xe,x.unstable_wrapCallback=function(b){var N=dt;return function(){var Y=dt;dt=N;try{return b.apply(this,arguments)}finally{dt=Y}}}})(or)),or}var Ed;function fh(){return Ed||(Ed=1,fr.exports=rh()),fr.exports}var sr={exports:{}},Ht={};var Td;function oh(){if(Td)return Ht;Td=1;var x=gr();function O(A){var S="https://react.dev/errors/"+A;if(1<arguments.length){S+="?args[]="+encodeURIComponent(arguments[1]);for(var J=2;J<arguments.length;J++)S+="&args[]="+encodeURIComponent(arguments[J])}return"Minified React error #"+A+"; visit "+S+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function C(){}var p={d:{f:C,r:function(){throw Error(O(522))},D:C,C,L:C,m:C,X:C,S:C,M:C},p:0,findDOMNode:null},R=Symbol.for("react.portal");function H(A,S,J){var U=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:R,key:U==null?null:""+U,children:A,containerInfo:S,implementation:J}}var k=x.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function ht(A,S){if(A==="font")return"";if(typeof S=="string")return S==="use-credentials"?S:""}return Ht.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=p,Ht.createPortal=function(A,S){var J=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!S||S.nodeType!==1&&S.nodeType!==9&&S.nodeType!==11)throw Error(O(299));return H(A,S,null,J)},Ht.flushSync=function(A){var S=k.T,J=p.p;try{if(k.T=null,p.p=2,A)return A()}finally{k.T=S,p.p=J,p.d.f()}},Ht.preconnect=function(A,S){typeof A=="string"&&(S?(S=S.crossOrigin,S=typeof S=="string"?S==="use-credentials"?S:"":void 0):S=null,p.d.C(A,S))},Ht.prefetchDNS=function(A){typeof A=="string"&&p.d.D(A)},Ht.preinit=function(A,S){if(typeof A=="string"&&S&&typeof S.as=="string"){var J=S.as,U=ht(J,S.crossOrigin),dt=typeof S.integrity=="string"?S.integrity:void 0,Yt=typeof S.fetchPriority=="string"?S.fetchPriority:void 0;J==="style"?p.d.S(A,typeof S.precedence=="string"?S.precedence:void 0,{crossOrigin:U,integrity:dt,fetchPriority:Yt}):J==="script"&&p.d.X(A,{crossOrigin:U,integrity:dt,fetchPriority:Yt,nonce:typeof S.nonce=="string"?S.nonce:void 0})}},Ht.preinitModule=function(A,S){if(typeof A=="string")if(typeof S=="object"&&S!==null){if(S.as==null||S.as==="script"){var J=ht(S.as,S.crossOrigin);p.d.M(A,{crossOrigin:J,integrity:typeof S.integrity=="string"?S.integrity:void 0,nonce:typeof S.nonce=="string"?S.nonce:void 0})}}else S==null&&p.d.M(A)},Ht.preload=function(A,S){if(typeof A=="string"&&typeof S=="object"&&S!==null&&typeof S.as=="string"){var J=S.as,U=ht(J,S.crossOrigin);p.d.L(A,J,{crossOrigin:U,integrity:typeof S.integrity=="string"?S.integrity:void 0,nonce:typeof S.nonce=="string"?S.nonce:void 0,type:typeof S.type=="string"?S.type:void 0,fetchPriority:typeof S.fetchPriority=="string"?S.fetchPriority:void 0,referrerPolicy:typeof S.referrerPolicy=="string"?S.referrerPolicy:void 0,imageSrcSet:typeof S.imageSrcSet=="string"?S.imageSrcSet:void 0,imageSizes:typeof S.imageSizes=="string"?S.imageSizes:void 0,media:typeof S.media=="string"?S.media:void 0})}},Ht.preloadModule=function(A,S){if(typeof A=="string")if(S){var J=ht(S.as,S.crossOrigin);p.d.m(A,{as:typeof S.as=="string"&&S.as!=="script"?S.as:void 0,crossOrigin:J,integrity:typeof S.integrity=="string"?S.integrity:void 0})}else p.d.m(A)},Ht.requestFormReset=function(A){p.d.r(A)},Ht.unstable_batchedUpdates=function(A,S){return A(S)},Ht.useFormState=function(A,S,J){return k.H.useFormState(A,S,J)},Ht.useFormStatus=function(){return k.H.useHostTransitionStatus()},Ht.version="19.2.1",Ht}var Ad;function sh(){if(Ad)return sr.exports;Ad=1;function x(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(x)}catch(O){console.error(O)}}return x(),sr.exports=oh(),sr.exports}var Nd;function dh(){if(Nd)return zn;Nd=1;var x=fh(),O=gr(),C=sh();function p(t){var a="https://react.dev/errors/"+t;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var e=2;e<arguments.length;e++)a+="&args[]="+encodeURIComponent(arguments[e])}return"Minified React error #"+t+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function R(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function H(t){var a=t,e=t;if(t.alternate)for(;a.return;)a=a.return;else{t=a;do a=t,(a.flags&4098)!==0&&(e=a.return),t=a.return;while(t)}return a.tag===3?e:null}function k(t){if(t.tag===13){var a=t.memoizedState;if(a===null&&(t=t.alternate,t!==null&&(a=t.memoizedState)),a!==null)return a.dehydrated}return null}function ht(t){if(t.tag===31){var a=t.memoizedState;if(a===null&&(t=t.alternate,t!==null&&(a=t.memoizedState)),a!==null)return a.dehydrated}return null}function A(t){if(H(t)!==t)throw Error(p(188))}function S(t){var a=t.alternate;if(!a){if(a=H(t),a===null)throw Error(p(188));return a!==t?null:t}for(var e=t,l=a;;){var n=e.return;if(n===null)break;var i=n.alternate;if(i===null){if(l=n.return,l!==null){e=l;continue}break}if(n.child===i.child){for(i=n.child;i;){if(i===e)return A(n),t;if(i===l)return A(n),a;i=i.sibling}throw Error(p(188))}if(e.return!==l.return)e=n,l=i;else{for(var u=!1,c=n.child;c;){if(c===e){u=!0,e=n,l=i;break}if(c===l){u=!0,l=n,e=i;break}c=c.sibling}if(!u){for(c=i.child;c;){if(c===e){u=!0,e=i,l=n;break}if(c===l){u=!0,l=i,e=n;break}c=c.sibling}if(!u)throw Error(p(189))}}if(e.alternate!==l)throw Error(p(190))}if(e.tag!==3)throw Error(p(188));return e.stateNode.current===e?t:a}function J(t){var a=t.tag;if(a===5||a===26||a===27||a===6)return t;for(t=t.child;t!==null;){if(a=J(t),a!==null)return a;t=t.sibling}return null}var U=Object.assign,dt=Symbol.for("react.element"),Yt=Symbol.for("react.transitional.element"),Q=Symbol.for("react.portal"),lt=Symbol.for("react.fragment"),ra=Symbol.for("react.strict_mode"),Lt=Symbol.for("react.profiler"),Wa=Symbol.for("react.consumer"),Bt=Symbol.for("react.context"),fa=Symbol.for("react.forward_ref"),Ta=Symbol.for("react.suspense"),Xt=Symbol.for("react.suspense_list"),$=Symbol.for("react.memo"),Qt=Symbol.for("react.lazy"),Aa=Symbol.for("react.activity"),Xe=Symbol.for("react.memo_cache_sentinel"),Na=Symbol.iterator;function Zt(t){return t===null||typeof t!="object"?null:(t=Na&&t[Na]||t["@@iterator"],typeof t=="function"?t:null)}var ze=Symbol.for("react.client.reference");function _a(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===ze?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case lt:return"Fragment";case Lt:return"Profiler";case ra:return"StrictMode";case Ta:return"Suspense";case Xt:return"SuspenseList";case Aa:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Q:return"Portal";case Bt:return t.displayName||"Context";case Wa:return(t._context.displayName||"Context")+".Consumer";case fa:var a=t.render;return t=t.displayName,t||(t=a.displayName||a.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case $:return a=t.displayName||null,a!==null?a:_a(t.type)||"Memo";case Qt:a=t._payload,t=t._init;try{return _a(t(a))}catch{}}return null}var ba=Array.isArray,b=O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,N=C.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y={pending:!1,data:null,method:null,action:null},ut=[],ot=-1;function s(t){return{current:t}}function T(t){0>ot||(t.current=ut[ot],ut[ot]=null,ot--)}function j(t,a){ot++,ut[ot]=t.current,t.current=a}var w=s(null),q=s(null),Z=s(null),et=s(null);function qt(t,a){switch(j(Z,a),j(q,t),j(w,null),a.nodeType){case 9:case 11:t=(t=a.documentElement)&&(t=t.namespaceURI)?Gs(t):0;break;default:if(t=a.tagName,a=a.namespaceURI)a=Gs(a),t=Xs(a,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}T(w),j(w,t)}function bt(){T(w),T(q),T(Z)}function jl(t){t.memoizedState!==null&&j(et,t);var a=w.current,e=Xs(a,t.type);a!==e&&(j(q,t),j(w,e))}function En(t){q.current===t&&(T(w),T(q)),et.current===t&&(T(et),xn._currentValue=Y)}var Xi,hr;function Ee(t){if(Xi===void 0)try{throw Error()}catch(e){var a=e.stack.trim().match(/\n( *(at )?)/);Xi=a&&a[1]||"",hr=-1<e.stack.indexOf(`
    at`)?" (<anonymous>)":-1<e.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Xi+t+hr}var Qi=!1;function Zi(t,a){if(!t||Qi)return"";Qi=!0;var e=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(a){var E=function(){throw Error()};if(Object.defineProperty(E.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(E,[])}catch(v){var m=v}Reflect.construct(t,[],E)}else{try{E.call()}catch(v){m=v}t.call(E.prototype)}}else{try{throw Error()}catch(v){m=v}(E=t())&&typeof E.catch=="function"&&E.catch(function(){})}}catch(v){if(v&&m&&typeof v.stack=="string")return[v.stack,m.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var n=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");n&&n.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),u=i[0],c=i[1];if(u&&c){var f=u.split(`
`),h=c.split(`
`);for(n=l=0;l<f.length&&!f[l].includes("DetermineComponentFrameRoot");)l++;for(;n<h.length&&!h[n].includes("DetermineComponentFrameRoot");)n++;if(l===f.length||n===h.length)for(l=f.length-1,n=h.length-1;1<=l&&0<=n&&f[l]!==h[n];)n--;for(;1<=l&&0<=n;l--,n--)if(f[l]!==h[n]){if(l!==1||n!==1)do if(l--,n--,0>n||f[l]!==h[n]){var y=`
`+f[l].replace(" at new "," at ");return t.displayName&&y.includes("<anonymous>")&&(y=y.replace("<anonymous>",t.displayName)),y}while(1<=l&&0<=n);break}}}finally{Qi=!1,Error.prepareStackTrace=e}return(e=t?t.displayName||t.name:"")?Ee(e):""}function Ud(t,a){switch(t.tag){case 26:case 27:case 5:return Ee(t.type);case 16:return Ee("Lazy");case 13:return t.child!==a&&a!==null?Ee("Suspense Fallback"):Ee("Suspense");case 19:return Ee("SuspenseList");case 0:case 15:return Zi(t.type,!1);case 11:return Zi(t.type.render,!1);case 1:return Zi(t.type,!0);case 31:return Ee("Activity");default:return""}}function mr(t){try{var a="",e=null;do a+=Ud(t,e),e=t,t=t.return;while(t);return a}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Vi=Object.prototype.hasOwnProperty,Ki=x.unstable_scheduleCallback,ki=x.unstable_cancelCallback,Bd=x.unstable_shouldYield,Hd=x.unstable_requestPaint,It=x.unstable_now,Yd=x.unstable_getCurrentPriorityLevel,xr=x.unstable_ImmediatePriority,vr=x.unstable_UserBlockingPriority,Tn=x.unstable_NormalPriority,Ld=x.unstable_LowPriority,yr=x.unstable_IdlePriority,qd=x.log,Gd=x.unstable_setDisableYieldValue,Ol=null,Pt=null;function $a(t){if(typeof qd=="function"&&Gd(t),Pt&&typeof Pt.setStrictMode=="function")try{Pt.setStrictMode(Ol,t)}catch{}}var ta=Math.clz32?Math.clz32:Zd,Xd=Math.log,Qd=Math.LN2;function Zd(t){return t>>>=0,t===0?32:31-(Xd(t)/Qd|0)|0}var An=256,Nn=262144,jn=4194304;function Te(t){var a=t&42;if(a!==0)return a;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function On(t,a,e){var l=t.pendingLanes;if(l===0)return 0;var n=0,i=t.suspendedLanes,u=t.pingedLanes;t=t.warmLanes;var c=l&134217727;return c!==0?(l=c&~i,l!==0?n=Te(l):(u&=c,u!==0?n=Te(u):e||(e=c&~t,e!==0&&(n=Te(e))))):(c=l&~i,c!==0?n=Te(c):u!==0?n=Te(u):e||(e=l&~t,e!==0&&(n=Te(e)))),n===0?0:a!==0&&a!==n&&(a&i)===0&&(i=n&-n,e=a&-a,i>=e||i===32&&(e&4194048)!==0)?a:n}function Ml(t,a){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&a)===0}function Vd(t,a){switch(t){case 1:case 2:case 4:case 8:case 64:return a+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function br(){var t=jn;return jn<<=1,(jn&62914560)===0&&(jn=4194304),t}function Ji(t){for(var a=[],e=0;31>e;e++)a.push(t);return a}function wl(t,a){t.pendingLanes|=a,a!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Kd(t,a,e,l,n,i){var u=t.pendingLanes;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=e,t.entangledLanes&=e,t.errorRecoveryDisabledLanes&=e,t.shellSuspendCounter=0;var c=t.entanglements,f=t.expirationTimes,h=t.hiddenUpdates;for(e=u&~e;0<e;){var y=31-ta(e),E=1<<y;c[y]=0,f[y]=-1;var m=h[y];if(m!==null)for(h[y]=null,y=0;y<m.length;y++){var v=m[y];v!==null&&(v.lane&=-536870913)}e&=~E}l!==0&&Sr(t,l,0),i!==0&&n===0&&t.tag!==0&&(t.suspendedLanes|=i&~(u&~a))}function Sr(t,a,e){t.pendingLanes|=a,t.suspendedLanes&=~a;var l=31-ta(a);t.entangledLanes|=a,t.entanglements[l]=t.entanglements[l]|1073741824|e&261930}function zr(t,a){var e=t.entangledLanes|=a;for(t=t.entanglements;e;){var l=31-ta(e),n=1<<l;n&a|t[l]&a&&(t[l]|=a),e&=~n}}function Er(t,a){var e=a&-a;return e=(e&42)!==0?1:Fi(e),(e&(t.suspendedLanes|a))!==0?0:e}function Fi(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function Wi(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Tr(){var t=N.p;return t!==0?t:(t=window.event,t===void 0?32:sd(t.type))}function Ar(t,a){var e=N.p;try{return N.p=t,a()}finally{N.p=e}}var Ia=Math.random().toString(36).slice(2),_t="__reactFiber$"+Ia,Vt="__reactProps$"+Ia,Qe="__reactContainer$"+Ia,$i="__reactEvents$"+Ia,kd="__reactListeners$"+Ia,Jd="__reactHandles$"+Ia,Nr="__reactResources$"+Ia,_l="__reactMarker$"+Ia;function Ii(t){delete t[_t],delete t[Vt],delete t[$i],delete t[kd],delete t[Jd]}function Ze(t){var a=t[_t];if(a)return a;for(var e=t.parentNode;e;){if(a=e[Qe]||e[_t]){if(e=a.alternate,a.child!==null||e!==null&&e.child!==null)for(t=Fs(t);t!==null;){if(e=t[_t])return e;t=Fs(t)}return a}t=e,e=t.parentNode}return null}function Ve(t){if(t=t[_t]||t[Qe]){var a=t.tag;if(a===5||a===6||a===13||a===31||a===26||a===27||a===3)return t}return null}function Dl(t){var a=t.tag;if(a===5||a===26||a===27||a===6)return t.stateNode;throw Error(p(33))}function Ke(t){var a=t[Nr];return a||(a=t[Nr]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function Ot(t){t[_l]=!0}var jr=new Set,Or={};function Ae(t,a){ke(t,a),ke(t+"Capture",a)}function ke(t,a){for(Or[t]=a,t=0;t<a.length;t++)jr.add(a[t])}var Fd=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Mr={},wr={};function Wd(t){return Vi.call(wr,t)?!0:Vi.call(Mr,t)?!1:Fd.test(t)?wr[t]=!0:(Mr[t]=!0,!1)}function Mn(t,a,e){if(Wd(a))if(e===null)t.removeAttribute(a);else{switch(typeof e){case"undefined":case"function":case"symbol":t.removeAttribute(a);return;case"boolean":var l=a.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){t.removeAttribute(a);return}}t.setAttribute(a,""+e)}}function wn(t,a,e){if(e===null)t.removeAttribute(a);else{switch(typeof e){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttribute(a,""+e)}}function Da(t,a,e,l){if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttributeNS(a,e,""+l)}}function oa(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function _r(t){var a=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function $d(t,a,e){var l=Object.getOwnPropertyDescriptor(t.constructor.prototype,a);if(!t.hasOwnProperty(a)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var n=l.get,i=l.set;return Object.defineProperty(t,a,{configurable:!0,get:function(){return n.call(this)},set:function(u){e=""+u,i.call(this,u)}}),Object.defineProperty(t,a,{enumerable:l.enumerable}),{getValue:function(){return e},setValue:function(u){e=""+u},stopTracking:function(){t._valueTracker=null,delete t[a]}}}}function Pi(t){if(!t._valueTracker){var a=_r(t)?"checked":"value";t._valueTracker=$d(t,a,""+t[a])}}function Dr(t){if(!t)return!1;var a=t._valueTracker;if(!a)return!0;var e=a.getValue(),l="";return t&&(l=_r(t)?t.checked?"true":"false":t.value),t=l,t!==e?(a.setValue(t),!0):!1}function _n(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var Id=/[\n"\\]/g;function sa(t){return t.replace(Id,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function tu(t,a,e,l,n,i,u,c){t.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?t.type=u:t.removeAttribute("type"),a!=null?u==="number"?(a===0&&t.value===""||t.value!=a)&&(t.value=""+oa(a)):t.value!==""+oa(a)&&(t.value=""+oa(a)):u!=="submit"&&u!=="reset"||t.removeAttribute("value"),a!=null?au(t,u,oa(a)):e!=null?au(t,u,oa(e)):l!=null&&t.removeAttribute("value"),n==null&&i!=null&&(t.defaultChecked=!!i),n!=null&&(t.checked=n&&typeof n!="function"&&typeof n!="symbol"),c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?t.name=""+oa(c):t.removeAttribute("name")}function Cr(t,a,e,l,n,i,u,c){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(t.type=i),a!=null||e!=null){if(!(i!=="submit"&&i!=="reset"||a!=null)){Pi(t);return}e=e!=null?""+oa(e):"",a=a!=null?""+oa(a):e,c||a===t.value||(t.value=a),t.defaultValue=a}l=l??n,l=typeof l!="function"&&typeof l!="symbol"&&!!l,t.checked=c?t.checked:!!l,t.defaultChecked=!!l,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(t.name=u),Pi(t)}function au(t,a,e){a==="number"&&_n(t.ownerDocument)===t||t.defaultValue===""+e||(t.defaultValue=""+e)}function Je(t,a,e,l){if(t=t.options,a){a={};for(var n=0;n<e.length;n++)a["$"+e[n]]=!0;for(e=0;e<t.length;e++)n=a.hasOwnProperty("$"+t[e].value),t[e].selected!==n&&(t[e].selected=n),n&&l&&(t[e].defaultSelected=!0)}else{for(e=""+oa(e),a=null,n=0;n<t.length;n++){if(t[n].value===e){t[n].selected=!0,l&&(t[n].defaultSelected=!0);return}a!==null||t[n].disabled||(a=t[n])}a!==null&&(a.selected=!0)}}function Rr(t,a,e){if(a!=null&&(a=""+oa(a),a!==t.value&&(t.value=a),e==null)){t.defaultValue!==a&&(t.defaultValue=a);return}t.defaultValue=e!=null?""+oa(e):""}function Ur(t,a,e,l){if(a==null){if(l!=null){if(e!=null)throw Error(p(92));if(ba(l)){if(1<l.length)throw Error(p(93));l=l[0]}e=l}e==null&&(e=""),a=e}e=oa(a),t.defaultValue=e,l=t.textContent,l===e&&l!==""&&l!==null&&(t.value=l),Pi(t)}function Fe(t,a){if(a){var e=t.firstChild;if(e&&e===t.lastChild&&e.nodeType===3){e.nodeValue=a;return}}t.textContent=a}var Pd=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Br(t,a,e){var l=a.indexOf("--")===0;e==null||typeof e=="boolean"||e===""?l?t.setProperty(a,""):a==="float"?t.cssFloat="":t[a]="":l?t.setProperty(a,e):typeof e!="number"||e===0||Pd.has(a)?a==="float"?t.cssFloat=e:t[a]=(""+e).trim():t[a]=e+"px"}function Hr(t,a,e){if(a!=null&&typeof a!="object")throw Error(p(62));if(t=t.style,e!=null){for(var l in e)!e.hasOwnProperty(l)||a!=null&&a.hasOwnProperty(l)||(l.indexOf("--")===0?t.setProperty(l,""):l==="float"?t.cssFloat="":t[l]="");for(var n in a)l=a[n],a.hasOwnProperty(n)&&e[n]!==l&&Br(t,n,l)}else for(var i in a)a.hasOwnProperty(i)&&Br(t,i,a[i])}function eu(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var tp=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),ap=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Dn(t){return ap.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Ca(){}var lu=null;function nu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var We=null,$e=null;function Yr(t){var a=Ve(t);if(a&&(t=a.stateNode)){var e=t[Vt]||null;t:switch(t=a.stateNode,a.type){case"input":if(tu(t,e.value,e.defaultValue,e.defaultValue,e.checked,e.defaultChecked,e.type,e.name),a=e.name,e.type==="radio"&&a!=null){for(e=t;e.parentNode;)e=e.parentNode;for(e=e.querySelectorAll('input[name="'+sa(""+a)+'"][type="radio"]'),a=0;a<e.length;a++){var l=e[a];if(l!==t&&l.form===t.form){var n=l[Vt]||null;if(!n)throw Error(p(90));tu(l,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name)}}for(a=0;a<e.length;a++)l=e[a],l.form===t.form&&Dr(l)}break t;case"textarea":Rr(t,e.value,e.defaultValue);break t;case"select":a=e.value,a!=null&&Je(t,!!e.multiple,a,!1)}}}var iu=!1;function Lr(t,a,e){if(iu)return t(a,e);iu=!0;try{var l=t(a);return l}finally{if(iu=!1,(We!==null||$e!==null)&&(yi(),We&&(a=We,t=$e,$e=We=null,Yr(a),t)))for(a=0;a<t.length;a++)Yr(t[a])}}function Cl(t,a){var e=t.stateNode;if(e===null)return null;var l=e[Vt]||null;if(l===null)return null;e=l[a];t:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break t;default:t=!1}if(t)return null;if(e&&typeof e!="function")throw Error(p(231,a,typeof e));return e}var Ra=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),uu=!1;if(Ra)try{var Rl={};Object.defineProperty(Rl,"passive",{get:function(){uu=!0}}),window.addEventListener("test",Rl,Rl),window.removeEventListener("test",Rl,Rl)}catch{uu=!1}var Pa=null,cu=null,Cn=null;function qr(){if(Cn)return Cn;var t,a=cu,e=a.length,l,n="value"in Pa?Pa.value:Pa.textContent,i=n.length;for(t=0;t<e&&a[t]===n[t];t++);var u=e-t;for(l=1;l<=u&&a[e-l]===n[i-l];l++);return Cn=n.slice(t,1<l?1-l:void 0)}function Rn(t){var a=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&a===13&&(t=13)):t=a,t===10&&(t=13),32<=t||t===13?t:0}function Un(){return!0}function Gr(){return!1}function Kt(t){function a(e,l,n,i,u){this._reactName=e,this._targetInst=n,this.type=l,this.nativeEvent=i,this.target=u,this.currentTarget=null;for(var c in t)t.hasOwnProperty(c)&&(e=t[c],this[c]=e?e(i):i[c]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Un:Gr,this.isPropagationStopped=Gr,this}return U(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!="unknown"&&(e.returnValue=!1),this.isDefaultPrevented=Un)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!="unknown"&&(e.cancelBubble=!0),this.isPropagationStopped=Un)},persist:function(){},isPersistent:Un}),a}var Ne={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Bn=Kt(Ne),Ul=U({},Ne,{view:0,detail:0}),ep=Kt(Ul),ru,fu,Bl,Hn=U({},Ul,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:su,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Bl&&(Bl&&t.type==="mousemove"?(ru=t.screenX-Bl.screenX,fu=t.screenY-Bl.screenY):fu=ru=0,Bl=t),ru)},movementY:function(t){return"movementY"in t?t.movementY:fu}}),Xr=Kt(Hn),lp=U({},Hn,{dataTransfer:0}),np=Kt(lp),ip=U({},Ul,{relatedTarget:0}),ou=Kt(ip),up=U({},Ne,{animationName:0,elapsedTime:0,pseudoElement:0}),cp=Kt(up),rp=U({},Ne,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),fp=Kt(rp),op=U({},Ne,{data:0}),Qr=Kt(op),sp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},dp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function gp(t){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(t):(t=pp[t])?!!a[t]:!1}function su(){return gp}var hp=U({},Ul,{key:function(t){if(t.key){var a=sp[t.key]||t.key;if(a!=="Unidentified")return a}return t.type==="keypress"?(t=Rn(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?dp[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:su,charCode:function(t){return t.type==="keypress"?Rn(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Rn(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),mp=Kt(hp),xp=U({},Hn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Zr=Kt(xp),vp=U({},Ul,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:su}),yp=Kt(vp),bp=U({},Ne,{propertyName:0,elapsedTime:0,pseudoElement:0}),Sp=Kt(bp),zp=U({},Hn,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Ep=Kt(zp),Tp=U({},Ne,{newState:0,oldState:0}),Ap=Kt(Tp),Np=[9,13,27,32],du=Ra&&"CompositionEvent"in window,Hl=null;Ra&&"documentMode"in document&&(Hl=document.documentMode);var jp=Ra&&"TextEvent"in window&&!Hl,Vr=Ra&&(!du||Hl&&8<Hl&&11>=Hl),Kr=" ",kr=!1;function Jr(t,a){switch(t){case"keyup":return Np.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Fr(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ie=!1;function Op(t,a){switch(t){case"compositionend":return Fr(a);case"keypress":return a.which!==32?null:(kr=!0,Kr);case"textInput":return t=a.data,t===Kr&&kr?null:t;default:return null}}function Mp(t,a){if(Ie)return t==="compositionend"||!du&&Jr(t,a)?(t=qr(),Cn=cu=Pa=null,Ie=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return Vr&&a.locale!=="ko"?null:a.data;default:return null}}var wp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wr(t){var a=t&&t.nodeName&&t.nodeName.toLowerCase();return a==="input"?!!wp[t.type]:a==="textarea"}function $r(t,a,e,l){We?$e?$e.push(l):$e=[l]:We=l,a=Ni(a,"onChange"),0<a.length&&(e=new Bn("onChange","change",null,e,l),t.push({event:e,listeners:a}))}var Yl=null,Ll=null;function _p(t){Us(t,0)}function Yn(t){var a=Dl(t);if(Dr(a))return t}function Ir(t,a){if(t==="change")return a}var Pr=!1;if(Ra){var pu;if(Ra){var gu="oninput"in document;if(!gu){var tf=document.createElement("div");tf.setAttribute("oninput","return;"),gu=typeof tf.oninput=="function"}pu=gu}else pu=!1;Pr=pu&&(!document.documentMode||9<document.documentMode)}function af(){Yl&&(Yl.detachEvent("onpropertychange",ef),Ll=Yl=null)}function ef(t){if(t.propertyName==="value"&&Yn(Ll)){var a=[];$r(a,Ll,t,nu(t)),Lr(_p,a)}}function Dp(t,a,e){t==="focusin"?(af(),Yl=a,Ll=e,Yl.attachEvent("onpropertychange",ef)):t==="focusout"&&af()}function Cp(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Yn(Ll)}function Rp(t,a){if(t==="click")return Yn(a)}function Up(t,a){if(t==="input"||t==="change")return Yn(a)}function Bp(t,a){return t===a&&(t!==0||1/t===1/a)||t!==t&&a!==a}var aa=typeof Object.is=="function"?Object.is:Bp;function ql(t,a){if(aa(t,a))return!0;if(typeof t!="object"||t===null||typeof a!="object"||a===null)return!1;var e=Object.keys(t),l=Object.keys(a);if(e.length!==l.length)return!1;for(l=0;l<e.length;l++){var n=e[l];if(!Vi.call(a,n)||!aa(t[n],a[n]))return!1}return!0}function lf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function nf(t,a){var e=lf(t);t=0;for(var l;e;){if(e.nodeType===3){if(l=t+e.textContent.length,t<=a&&l>=a)return{node:e,offset:a-t};t=l}t:{for(;e;){if(e.nextSibling){e=e.nextSibling;break t}e=e.parentNode}e=void 0}e=lf(e)}}function uf(t,a){return t&&a?t===a?!0:t&&t.nodeType===3?!1:a&&a.nodeType===3?uf(t,a.parentNode):"contains"in t?t.contains(a):t.compareDocumentPosition?!!(t.compareDocumentPosition(a)&16):!1:!1}function cf(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var a=_n(t.document);a instanceof t.HTMLIFrameElement;){try{var e=typeof a.contentWindow.location.href=="string"}catch{e=!1}if(e)t=a.contentWindow;else break;a=_n(t.document)}return a}function hu(t){var a=t&&t.nodeName&&t.nodeName.toLowerCase();return a&&(a==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||a==="textarea"||t.contentEditable==="true")}var Hp=Ra&&"documentMode"in document&&11>=document.documentMode,Pe=null,mu=null,Gl=null,xu=!1;function rf(t,a,e){var l=e.window===e?e.document:e.nodeType===9?e:e.ownerDocument;xu||Pe==null||Pe!==_n(l)||(l=Pe,"selectionStart"in l&&hu(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Gl&&ql(Gl,l)||(Gl=l,l=Ni(mu,"onSelect"),0<l.length&&(a=new Bn("onSelect","select",null,a,e),t.push({event:a,listeners:l}),a.target=Pe)))}function je(t,a){var e={};return e[t.toLowerCase()]=a.toLowerCase(),e["Webkit"+t]="webkit"+a,e["Moz"+t]="moz"+a,e}var tl={animationend:je("Animation","AnimationEnd"),animationiteration:je("Animation","AnimationIteration"),animationstart:je("Animation","AnimationStart"),transitionrun:je("Transition","TransitionRun"),transitionstart:je("Transition","TransitionStart"),transitioncancel:je("Transition","TransitionCancel"),transitionend:je("Transition","TransitionEnd")},vu={},ff={};Ra&&(ff=document.createElement("div").style,"AnimationEvent"in window||(delete tl.animationend.animation,delete tl.animationiteration.animation,delete tl.animationstart.animation),"TransitionEvent"in window||delete tl.transitionend.transition);function Oe(t){if(vu[t])return vu[t];if(!tl[t])return t;var a=tl[t],e;for(e in a)if(a.hasOwnProperty(e)&&e in ff)return vu[t]=a[e];return t}var of=Oe("animationend"),sf=Oe("animationiteration"),df=Oe("animationstart"),Yp=Oe("transitionrun"),Lp=Oe("transitionstart"),qp=Oe("transitioncancel"),pf=Oe("transitionend"),gf=new Map,yu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");yu.push("scrollEnd");function Sa(t,a){gf.set(t,a),Ae(a,[t])}var Ln=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},da=[],al=0,bu=0;function qn(){for(var t=al,a=bu=al=0;a<t;){var e=da[a];da[a++]=null;var l=da[a];da[a++]=null;var n=da[a];da[a++]=null;var i=da[a];if(da[a++]=null,l!==null&&n!==null){var u=l.pending;u===null?n.next=n:(n.next=u.next,u.next=n),l.pending=n}i!==0&&hf(e,n,i)}}function Gn(t,a,e,l){da[al++]=t,da[al++]=a,da[al++]=e,da[al++]=l,bu|=l,t.lanes|=l,t=t.alternate,t!==null&&(t.lanes|=l)}function Su(t,a,e,l){return Gn(t,a,e,l),Xn(t)}function Me(t,a){return Gn(t,null,null,a),Xn(t)}function hf(t,a,e){t.lanes|=e;var l=t.alternate;l!==null&&(l.lanes|=e);for(var n=!1,i=t.return;i!==null;)i.childLanes|=e,l=i.alternate,l!==null&&(l.childLanes|=e),i.tag===22&&(t=i.stateNode,t===null||t._visibility&1||(n=!0)),t=i,i=i.return;return t.tag===3?(i=t.stateNode,n&&a!==null&&(n=31-ta(e),t=i.hiddenUpdates,l=t[n],l===null?t[n]=[a]:l.push(a),a.lane=e|536870912),i):null}function Xn(t){if(50<on)throw on=0,wc=null,Error(p(185));for(var a=t.return;a!==null;)t=a,a=t.return;return t.tag===3?t.stateNode:null}var el={};function Gp(t,a,e,l){this.tag=t,this.key=e,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ea(t,a,e,l){return new Gp(t,a,e,l)}function zu(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Ua(t,a){var e=t.alternate;return e===null?(e=ea(t.tag,a,t.key,t.mode),e.elementType=t.elementType,e.type=t.type,e.stateNode=t.stateNode,e.alternate=t,t.alternate=e):(e.pendingProps=a,e.type=t.type,e.flags=0,e.subtreeFlags=0,e.deletions=null),e.flags=t.flags&65011712,e.childLanes=t.childLanes,e.lanes=t.lanes,e.child=t.child,e.memoizedProps=t.memoizedProps,e.memoizedState=t.memoizedState,e.updateQueue=t.updateQueue,a=t.dependencies,e.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},e.sibling=t.sibling,e.index=t.index,e.ref=t.ref,e.refCleanup=t.refCleanup,e}function mf(t,a){t.flags&=65011714;var e=t.alternate;return e===null?(t.childLanes=0,t.lanes=a,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,t.type=e.type,a=e.dependencies,t.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),t}function Qn(t,a,e,l,n,i){var u=0;if(l=t,typeof t=="function")zu(t)&&(u=1);else if(typeof t=="string")u=Kg(t,e,w.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case Aa:return t=ea(31,e,a,n),t.elementType=Aa,t.lanes=i,t;case lt:return we(e.children,n,i,a);case ra:u=8,n|=24;break;case Lt:return t=ea(12,e,a,n|2),t.elementType=Lt,t.lanes=i,t;case Ta:return t=ea(13,e,a,n),t.elementType=Ta,t.lanes=i,t;case Xt:return t=ea(19,e,a,n),t.elementType=Xt,t.lanes=i,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Bt:u=10;break t;case Wa:u=9;break t;case fa:u=11;break t;case $:u=14;break t;case Qt:u=16,l=null;break t}u=29,e=Error(p(130,t===null?"null":typeof t,"")),l=null}return a=ea(u,e,a,n),a.elementType=t,a.type=l,a.lanes=i,a}function we(t,a,e,l){return t=ea(7,t,l,a),t.lanes=e,t}function Eu(t,a,e){return t=ea(6,t,null,a),t.lanes=e,t}function xf(t){var a=ea(18,null,null,0);return a.stateNode=t,a}function Tu(t,a,e){return a=ea(4,t.children!==null?t.children:[],t.key,a),a.lanes=e,a.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},a}var vf=new WeakMap;function pa(t,a){if(typeof t=="object"&&t!==null){var e=vf.get(t);return e!==void 0?e:(a={value:t,source:a,stack:mr(a)},vf.set(t,a),a)}return{value:t,source:a,stack:mr(a)}}var ll=[],nl=0,Zn=null,Xl=0,ga=[],ha=0,te=null,ja=1,Oa="";function Ba(t,a){ll[nl++]=Xl,ll[nl++]=Zn,Zn=t,Xl=a}function yf(t,a,e){ga[ha++]=ja,ga[ha++]=Oa,ga[ha++]=te,te=t;var l=ja;t=Oa;var n=32-ta(l)-1;l&=~(1<<n),e+=1;var i=32-ta(a)+n;if(30<i){var u=n-n%5;i=(l&(1<<u)-1).toString(32),l>>=u,n-=u,ja=1<<32-ta(a)+n|e<<n|l,Oa=i+t}else ja=1<<i|e<<n|l,Oa=t}function Au(t){t.return!==null&&(Ba(t,1),yf(t,1,0))}function Nu(t){for(;t===Zn;)Zn=ll[--nl],ll[nl]=null,Xl=ll[--nl],ll[nl]=null;for(;t===te;)te=ga[--ha],ga[ha]=null,Oa=ga[--ha],ga[ha]=null,ja=ga[--ha],ga[ha]=null}function bf(t,a){ga[ha++]=ja,ga[ha++]=Oa,ga[ha++]=te,ja=a.id,Oa=a.overflow,te=t}var Dt=null,pt=null,I=!1,ae=null,ma=!1,ju=Error(p(519));function ee(t){var a=Error(p(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ql(pa(a,t)),ju}function Sf(t){var a=t.stateNode,e=t.type,l=t.memoizedProps;switch(a[_t]=t,a[Vt]=l,e){case"dialog":K("cancel",a),K("close",a);break;case"iframe":case"object":case"embed":K("load",a);break;case"video":case"audio":for(e=0;e<dn.length;e++)K(dn[e],a);break;case"source":K("error",a);break;case"img":case"image":case"link":K("error",a),K("load",a);break;case"details":K("toggle",a);break;case"input":K("invalid",a),Cr(a,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":K("invalid",a);break;case"textarea":K("invalid",a),Ur(a,l.value,l.defaultValue,l.children)}e=l.children,typeof e!="string"&&typeof e!="number"&&typeof e!="bigint"||a.textContent===""+e||l.suppressHydrationWarning===!0||Ls(a.textContent,e)?(l.popover!=null&&(K("beforetoggle",a),K("toggle",a)),l.onScroll!=null&&K("scroll",a),l.onScrollEnd!=null&&K("scrollend",a),l.onClick!=null&&(a.onclick=Ca),a=!0):a=!1,a||ee(t,!0)}function zf(t){for(Dt=t.return;Dt;)switch(Dt.tag){case 5:case 31:case 13:ma=!1;return;case 27:case 3:ma=!0;return;default:Dt=Dt.return}}function il(t){if(t!==Dt)return!1;if(!I)return zf(t),I=!0,!1;var a=t.tag,e;if((e=a!==3&&a!==27)&&((e=a===5)&&(e=t.type,e=!(e!=="form"&&e!=="button")||Vc(t.type,t.memoizedProps)),e=!e),e&&pt&&ee(t),zf(t),a===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(p(317));pt=Js(t)}else if(a===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(p(317));pt=Js(t)}else a===27?(a=pt,me(t.type)?(t=Wc,Wc=null,pt=t):pt=a):pt=Dt?va(t.stateNode.nextSibling):null;return!0}function _e(){pt=Dt=null,I=!1}function Ou(){var t=ae;return t!==null&&(Wt===null?Wt=t:Wt.push.apply(Wt,t),ae=null),t}function Ql(t){ae===null?ae=[t]:ae.push(t)}var Mu=s(null),De=null,Ha=null;function le(t,a,e){j(Mu,a._currentValue),a._currentValue=e}function Ya(t){t._currentValue=Mu.current,T(Mu)}function wu(t,a,e){for(;t!==null;){var l=t.alternate;if((t.childLanes&a)!==a?(t.childLanes|=a,l!==null&&(l.childLanes|=a)):l!==null&&(l.childLanes&a)!==a&&(l.childLanes|=a),t===e)break;t=t.return}}function _u(t,a,e,l){var n=t.child;for(n!==null&&(n.return=t);n!==null;){var i=n.dependencies;if(i!==null){var u=n.child;i=i.firstContext;t:for(;i!==null;){var c=i;i=n;for(var f=0;f<a.length;f++)if(c.context===a[f]){i.lanes|=e,c=i.alternate,c!==null&&(c.lanes|=e),wu(i.return,e,t),l||(u=null);break t}i=c.next}}else if(n.tag===18){if(u=n.return,u===null)throw Error(p(341));u.lanes|=e,i=u.alternate,i!==null&&(i.lanes|=e),wu(u,e,t),u=null}else u=n.child;if(u!==null)u.return=n;else for(u=n;u!==null;){if(u===t){u=null;break}if(n=u.sibling,n!==null){n.return=u.return,u=n;break}u=u.return}n=u}}function ul(t,a,e,l){t=null;for(var n=a,i=!1;n!==null;){if(!i){if((n.flags&524288)!==0)i=!0;else if((n.flags&262144)!==0)break}if(n.tag===10){var u=n.alternate;if(u===null)throw Error(p(387));if(u=u.memoizedProps,u!==null){var c=n.type;aa(n.pendingProps.value,u.value)||(t!==null?t.push(c):t=[c])}}else if(n===et.current){if(u=n.alternate,u===null)throw Error(p(387));u.memoizedState.memoizedState!==n.memoizedState.memoizedState&&(t!==null?t.push(xn):t=[xn])}n=n.return}t!==null&&_u(a,t,e,l),a.flags|=262144}function Vn(t){for(t=t.firstContext;t!==null;){if(!aa(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Ce(t){De=t,Ha=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Ct(t){return Ef(De,t)}function Kn(t,a){return De===null&&Ce(t),Ef(t,a)}function Ef(t,a){var e=a._currentValue;if(a={context:a,memoizedValue:e,next:null},Ha===null){if(t===null)throw Error(p(308));Ha=a,t.dependencies={lanes:0,firstContext:a},t.flags|=524288}else Ha=Ha.next=a;return e}var Xp=typeof AbortController<"u"?AbortController:function(){var t=[],a=this.signal={aborted:!1,addEventListener:function(e,l){t.push(l)}};this.abort=function(){a.aborted=!0,t.forEach(function(e){return e()})}},Qp=x.unstable_scheduleCallback,Zp=x.unstable_NormalPriority,Et={$$typeof:Bt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Du(){return{controller:new Xp,data:new Map,refCount:0}}function Zl(t){t.refCount--,t.refCount===0&&Qp(Zp,function(){t.controller.abort()})}var Vl=null,Cu=0,cl=0,rl=null;function Vp(t,a){if(Vl===null){var e=Vl=[];Cu=0,cl=Bc(),rl={status:"pending",value:void 0,then:function(l){e.push(l)}}}return Cu++,a.then(Tf,Tf),a}function Tf(){if(--Cu===0&&Vl!==null){rl!==null&&(rl.status="fulfilled");var t=Vl;Vl=null,cl=0,rl=null;for(var a=0;a<t.length;a++)(0,t[a])()}}function Kp(t,a){var e=[],l={status:"pending",value:null,reason:null,then:function(n){e.push(n)}};return t.then(function(){l.status="fulfilled",l.value=a;for(var n=0;n<e.length;n++)(0,e[n])(a)},function(n){for(l.status="rejected",l.reason=n,n=0;n<e.length;n++)(0,e[n])(void 0)}),l}var Af=b.S;b.S=function(t,a){fs=It(),typeof a=="object"&&a!==null&&typeof a.then=="function"&&Vp(t,a),Af!==null&&Af(t,a)};var Re=s(null);function Ru(){var t=Re.current;return t!==null?t:st.pooledCache}function kn(t,a){a===null?j(Re,Re.current):j(Re,a.pool)}function Nf(){var t=Ru();return t===null?null:{parent:Et._currentValue,pool:t}}var fl=Error(p(460)),Uu=Error(p(474)),Jn=Error(p(542)),Fn={then:function(){}};function jf(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Of(t,a,e){switch(e=t[e],e===void 0?t.push(a):e!==a&&(a.then(Ca,Ca),a=e),a.status){case"fulfilled":return a.value;case"rejected":throw t=a.reason,wf(t),t;default:if(typeof a.status=="string")a.then(Ca,Ca);else{if(t=st,t!==null&&100<t.shellSuspendCounter)throw Error(p(482));t=a,t.status="pending",t.then(function(l){if(a.status==="pending"){var n=a;n.status="fulfilled",n.value=l}},function(l){if(a.status==="pending"){var n=a;n.status="rejected",n.reason=l}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw t=a.reason,wf(t),t}throw Be=a,fl}}function Ue(t){try{var a=t._init;return a(t._payload)}catch(e){throw e!==null&&typeof e=="object"&&typeof e.then=="function"?(Be=e,fl):e}}var Be=null;function Mf(){if(Be===null)throw Error(p(459));var t=Be;return Be=null,t}function wf(t){if(t===fl||t===Jn)throw Error(p(483))}var ol=null,Kl=0;function Wn(t){var a=Kl;return Kl+=1,ol===null&&(ol=[]),Of(ol,t,a)}function kl(t,a){a=a.props.ref,t.ref=a!==void 0?a:null}function $n(t,a){throw a.$$typeof===dt?Error(p(525)):(t=Object.prototype.toString.call(a),Error(p(31,t==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":t)))}function _f(t){function a(d,o){if(t){var g=d.deletions;g===null?(d.deletions=[o],d.flags|=16):g.push(o)}}function e(d,o){if(!t)return null;for(;o!==null;)a(d,o),o=o.sibling;return null}function l(d){for(var o=new Map;d!==null;)d.key!==null?o.set(d.key,d):o.set(d.index,d),d=d.sibling;return o}function n(d,o){return d=Ua(d,o),d.index=0,d.sibling=null,d}function i(d,o,g){return d.index=g,t?(g=d.alternate,g!==null?(g=g.index,g<o?(d.flags|=67108866,o):g):(d.flags|=67108866,o)):(d.flags|=1048576,o)}function u(d){return t&&d.alternate===null&&(d.flags|=67108866),d}function c(d,o,g,z){return o===null||o.tag!==6?(o=Eu(g,d.mode,z),o.return=d,o):(o=n(o,g),o.return=d,o)}function f(d,o,g,z){var D=g.type;return D===lt?y(d,o,g.props.children,z,g.key):o!==null&&(o.elementType===D||typeof D=="object"&&D!==null&&D.$$typeof===Qt&&Ue(D)===o.type)?(o=n(o,g.props),kl(o,g),o.return=d,o):(o=Qn(g.type,g.key,g.props,null,d.mode,z),kl(o,g),o.return=d,o)}function h(d,o,g,z){return o===null||o.tag!==4||o.stateNode.containerInfo!==g.containerInfo||o.stateNode.implementation!==g.implementation?(o=Tu(g,d.mode,z),o.return=d,o):(o=n(o,g.children||[]),o.return=d,o)}function y(d,o,g,z,D){return o===null||o.tag!==7?(o=we(g,d.mode,z,D),o.return=d,o):(o=n(o,g),o.return=d,o)}function E(d,o,g){if(typeof o=="string"&&o!==""||typeof o=="number"||typeof o=="bigint")return o=Eu(""+o,d.mode,g),o.return=d,o;if(typeof o=="object"&&o!==null){switch(o.$$typeof){case Yt:return g=Qn(o.type,o.key,o.props,null,d.mode,g),kl(g,o),g.return=d,g;case Q:return o=Tu(o,d.mode,g),o.return=d,o;case Qt:return o=Ue(o),E(d,o,g)}if(ba(o)||Zt(o))return o=we(o,d.mode,g,null),o.return=d,o;if(typeof o.then=="function")return E(d,Wn(o),g);if(o.$$typeof===Bt)return E(d,Kn(d,o),g);$n(d,o)}return null}function m(d,o,g,z){var D=o!==null?o.key:null;if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return D!==null?null:c(d,o,""+g,z);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Yt:return g.key===D?f(d,o,g,z):null;case Q:return g.key===D?h(d,o,g,z):null;case Qt:return g=Ue(g),m(d,o,g,z)}if(ba(g)||Zt(g))return D!==null?null:y(d,o,g,z,null);if(typeof g.then=="function")return m(d,o,Wn(g),z);if(g.$$typeof===Bt)return m(d,o,Kn(d,g),z);$n(d,g)}return null}function v(d,o,g,z,D){if(typeof z=="string"&&z!==""||typeof z=="number"||typeof z=="bigint")return d=d.get(g)||null,c(o,d,""+z,D);if(typeof z=="object"&&z!==null){switch(z.$$typeof){case Yt:return d=d.get(z.key===null?g:z.key)||null,f(o,d,z,D);case Q:return d=d.get(z.key===null?g:z.key)||null,h(o,d,z,D);case Qt:return z=Ue(z),v(d,o,g,z,D)}if(ba(z)||Zt(z))return d=d.get(g)||null,y(o,d,z,D,null);if(typeof z.then=="function")return v(d,o,g,Wn(z),D);if(z.$$typeof===Bt)return v(d,o,g,Kn(o,z),D);$n(o,z)}return null}function M(d,o,g,z){for(var D=null,P=null,_=o,X=o=0,W=null;_!==null&&X<g.length;X++){_.index>X?(W=_,_=null):W=_.sibling;var tt=m(d,_,g[X],z);if(tt===null){_===null&&(_=W);break}t&&_&&tt.alternate===null&&a(d,_),o=i(tt,o,X),P===null?D=tt:P.sibling=tt,P=tt,_=W}if(X===g.length)return e(d,_),I&&Ba(d,X),D;if(_===null){for(;X<g.length;X++)_=E(d,g[X],z),_!==null&&(o=i(_,o,X),P===null?D=_:P.sibling=_,P=_);return I&&Ba(d,X),D}for(_=l(_);X<g.length;X++)W=v(_,d,X,g[X],z),W!==null&&(t&&W.alternate!==null&&_.delete(W.key===null?X:W.key),o=i(W,o,X),P===null?D=W:P.sibling=W,P=W);return t&&_.forEach(function(Se){return a(d,Se)}),I&&Ba(d,X),D}function B(d,o,g,z){if(g==null)throw Error(p(151));for(var D=null,P=null,_=o,X=o=0,W=null,tt=g.next();_!==null&&!tt.done;X++,tt=g.next()){_.index>X?(W=_,_=null):W=_.sibling;var Se=m(d,_,tt.value,z);if(Se===null){_===null&&(_=W);break}t&&_&&Se.alternate===null&&a(d,_),o=i(Se,o,X),P===null?D=Se:P.sibling=Se,P=Se,_=W}if(tt.done)return e(d,_),I&&Ba(d,X),D;if(_===null){for(;!tt.done;X++,tt=g.next())tt=E(d,tt.value,z),tt!==null&&(o=i(tt,o,X),P===null?D=tt:P.sibling=tt,P=tt);return I&&Ba(d,X),D}for(_=l(_);!tt.done;X++,tt=g.next())tt=v(_,d,X,tt.value,z),tt!==null&&(t&&tt.alternate!==null&&_.delete(tt.key===null?X:tt.key),o=i(tt,o,X),P===null?D=tt:P.sibling=tt,P=tt);return t&&_.forEach(function(lh){return a(d,lh)}),I&&Ba(d,X),D}function ft(d,o,g,z){if(typeof g=="object"&&g!==null&&g.type===lt&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Yt:t:{for(var D=g.key;o!==null;){if(o.key===D){if(D=g.type,D===lt){if(o.tag===7){e(d,o.sibling),z=n(o,g.props.children),z.return=d,d=z;break t}}else if(o.elementType===D||typeof D=="object"&&D!==null&&D.$$typeof===Qt&&Ue(D)===o.type){e(d,o.sibling),z=n(o,g.props),kl(z,g),z.return=d,d=z;break t}e(d,o);break}else a(d,o);o=o.sibling}g.type===lt?(z=we(g.props.children,d.mode,z,g.key),z.return=d,d=z):(z=Qn(g.type,g.key,g.props,null,d.mode,z),kl(z,g),z.return=d,d=z)}return u(d);case Q:t:{for(D=g.key;o!==null;){if(o.key===D)if(o.tag===4&&o.stateNode.containerInfo===g.containerInfo&&o.stateNode.implementation===g.implementation){e(d,o.sibling),z=n(o,g.children||[]),z.return=d,d=z;break t}else{e(d,o);break}else a(d,o);o=o.sibling}z=Tu(g,d.mode,z),z.return=d,d=z}return u(d);case Qt:return g=Ue(g),ft(d,o,g,z)}if(ba(g))return M(d,o,g,z);if(Zt(g)){if(D=Zt(g),typeof D!="function")throw Error(p(150));return g=D.call(g),B(d,o,g,z)}if(typeof g.then=="function")return ft(d,o,Wn(g),z);if(g.$$typeof===Bt)return ft(d,o,Kn(d,g),z);$n(d,g)}return typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint"?(g=""+g,o!==null&&o.tag===6?(e(d,o.sibling),z=n(o,g),z.return=d,d=z):(e(d,o),z=Eu(g,d.mode,z),z.return=d,d=z),u(d)):e(d,o)}return function(d,o,g,z){try{Kl=0;var D=ft(d,o,g,z);return ol=null,D}catch(_){if(_===fl||_===Jn)throw _;var P=ea(29,_,null,d.mode);return P.lanes=z,P.return=d,P}finally{}}}var He=_f(!0),Df=_f(!1),ne=!1;function Bu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Hu(t,a){t=t.updateQueue,a.updateQueue===t&&(a.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function ie(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function ue(t,a,e){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(at&2)!==0){var n=l.pending;return n===null?a.next=a:(a.next=n.next,n.next=a),l.pending=a,a=Xn(t),hf(t,null,e),a}return Gn(t,l,a,e),Xn(t)}function Jl(t,a,e){if(a=a.updateQueue,a!==null&&(a=a.shared,(e&4194048)!==0)){var l=a.lanes;l&=t.pendingLanes,e|=l,a.lanes=e,zr(t,e)}}function Yu(t,a){var e=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,e===l)){var n=null,i=null;if(e=e.firstBaseUpdate,e!==null){do{var u={lane:e.lane,tag:e.tag,payload:e.payload,callback:null,next:null};i===null?n=i=u:i=i.next=u,e=e.next}while(e!==null);i===null?n=i=a:i=i.next=a}else n=i=a;e={baseState:l.baseState,firstBaseUpdate:n,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},t.updateQueue=e;return}t=e.lastBaseUpdate,t===null?e.firstBaseUpdate=a:t.next=a,e.lastBaseUpdate=a}var Lu=!1;function Fl(){if(Lu){var t=rl;if(t!==null)throw t}}function Wl(t,a,e,l){Lu=!1;var n=t.updateQueue;ne=!1;var i=n.firstBaseUpdate,u=n.lastBaseUpdate,c=n.shared.pending;if(c!==null){n.shared.pending=null;var f=c,h=f.next;f.next=null,u===null?i=h:u.next=h,u=f;var y=t.alternate;y!==null&&(y=y.updateQueue,c=y.lastBaseUpdate,c!==u&&(c===null?y.firstBaseUpdate=h:c.next=h,y.lastBaseUpdate=f))}if(i!==null){var E=n.baseState;u=0,y=h=f=null,c=i;do{var m=c.lane&-536870913,v=m!==c.lane;if(v?(F&m)===m:(l&m)===m){m!==0&&m===cl&&(Lu=!0),y!==null&&(y=y.next={lane:0,tag:c.tag,payload:c.payload,callback:null,next:null});t:{var M=t,B=c;m=a;var ft=e;switch(B.tag){case 1:if(M=B.payload,typeof M=="function"){E=M.call(ft,E,m);break t}E=M;break t;case 3:M.flags=M.flags&-65537|128;case 0:if(M=B.payload,m=typeof M=="function"?M.call(ft,E,m):M,m==null)break t;E=U({},E,m);break t;case 2:ne=!0}}m=c.callback,m!==null&&(t.flags|=64,v&&(t.flags|=8192),v=n.callbacks,v===null?n.callbacks=[m]:v.push(m))}else v={lane:m,tag:c.tag,payload:c.payload,callback:c.callback,next:null},y===null?(h=y=v,f=E):y=y.next=v,u|=m;if(c=c.next,c===null){if(c=n.shared.pending,c===null)break;v=c,c=v.next,v.next=null,n.lastBaseUpdate=v,n.shared.pending=null}}while(!0);y===null&&(f=E),n.baseState=f,n.firstBaseUpdate=h,n.lastBaseUpdate=y,i===null&&(n.shared.lanes=0),se|=u,t.lanes=u,t.memoizedState=E}}function Cf(t,a){if(typeof t!="function")throw Error(p(191,t));t.call(a)}function Rf(t,a){var e=t.callbacks;if(e!==null)for(t.callbacks=null,t=0;t<e.length;t++)Cf(e[t],a)}var sl=s(null),In=s(0);function Uf(t,a){t=ka,j(In,t),j(sl,a),ka=t|a.baseLanes}function qu(){j(In,ka),j(sl,sl.current)}function Gu(){ka=In.current,T(sl),T(In)}var la=s(null),xa=null;function ce(t){var a=t.alternate;j(St,St.current&1),j(la,t),xa===null&&(a===null||sl.current!==null||a.memoizedState!==null)&&(xa=t)}function Xu(t){j(St,St.current),j(la,t),xa===null&&(xa=t)}function Bf(t){t.tag===22?(j(St,St.current),j(la,t),xa===null&&(xa=t)):re()}function re(){j(St,St.current),j(la,la.current)}function na(t){T(la),xa===t&&(xa=null),T(St)}var St=s(0);function Pn(t){for(var a=t;a!==null;){if(a.tag===13){var e=a.memoizedState;if(e!==null&&(e=e.dehydrated,e===null||Jc(e)||Fc(e)))return a}else if(a.tag===19&&(a.memoizedProps.revealOrder==="forwards"||a.memoizedProps.revealOrder==="backwards"||a.memoizedProps.revealOrder==="unstable_legacy-backwards"||a.memoizedProps.revealOrder==="together")){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break;for(;a.sibling===null;){if(a.return===null||a.return===t)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var La=0,G=null,ct=null,Tt=null,ti=!1,dl=!1,Ye=!1,ai=0,$l=0,pl=null,kp=0;function vt(){throw Error(p(321))}function Qu(t,a){if(a===null)return!1;for(var e=0;e<a.length&&e<t.length;e++)if(!aa(t[e],a[e]))return!1;return!0}function Zu(t,a,e,l,n,i){return La=i,G=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,b.H=t===null||t.memoizedState===null?bo:ic,Ye=!1,i=e(l,n),Ye=!1,dl&&(i=Yf(a,e,l,n)),Hf(t),i}function Hf(t){b.H=tn;var a=ct!==null&&ct.next!==null;if(La=0,Tt=ct=G=null,ti=!1,$l=0,pl=null,a)throw Error(p(300));t===null||At||(t=t.dependencies,t!==null&&Vn(t)&&(At=!0))}function Yf(t,a,e,l){G=t;var n=0;do{if(dl&&(pl=null),$l=0,dl=!1,25<=n)throw Error(p(301));if(n+=1,Tt=ct=null,t.updateQueue!=null){var i=t.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}b.H=So,i=a(e,l)}while(dl);return i}function Jp(){var t=b.H,a=t.useState()[0];return a=typeof a.then=="function"?Il(a):a,t=t.useState()[0],(ct!==null?ct.memoizedState:null)!==t&&(G.flags|=1024),a}function Vu(){var t=ai!==0;return ai=0,t}function Ku(t,a,e){a.updateQueue=t.updateQueue,a.flags&=-2053,t.lanes&=~e}function ku(t){if(ti){for(t=t.memoizedState;t!==null;){var a=t.queue;a!==null&&(a.pending=null),t=t.next}ti=!1}La=0,Tt=ct=G=null,dl=!1,$l=ai=0,pl=null}function Gt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Tt===null?G.memoizedState=Tt=t:Tt=Tt.next=t,Tt}function zt(){if(ct===null){var t=G.alternate;t=t!==null?t.memoizedState:null}else t=ct.next;var a=Tt===null?G.memoizedState:Tt.next;if(a!==null)Tt=a,ct=t;else{if(t===null)throw G.alternate===null?Error(p(467)):Error(p(310));ct=t,t={memoizedState:ct.memoizedState,baseState:ct.baseState,baseQueue:ct.baseQueue,queue:ct.queue,next:null},Tt===null?G.memoizedState=Tt=t:Tt=Tt.next=t}return Tt}function ei(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Il(t){var a=$l;return $l+=1,pl===null&&(pl=[]),t=Of(pl,t,a),a=G,(Tt===null?a.memoizedState:Tt.next)===null&&(a=a.alternate,b.H=a===null||a.memoizedState===null?bo:ic),t}function li(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Il(t);if(t.$$typeof===Bt)return Ct(t)}throw Error(p(438,String(t)))}function Ju(t){var a=null,e=G.updateQueue;if(e!==null&&(a=e.memoCache),a==null){var l=G.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(a={data:l.data.map(function(n){return n.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),e===null&&(e=ei(),G.updateQueue=e),e.memoCache=a,e=a.data[a.index],e===void 0)for(e=a.data[a.index]=Array(t),l=0;l<t;l++)e[l]=Xe;return a.index++,e}function qa(t,a){return typeof a=="function"?a(t):a}function ni(t){var a=zt();return Fu(a,ct,t)}function Fu(t,a,e){var l=t.queue;if(l===null)throw Error(p(311));l.lastRenderedReducer=e;var n=t.baseQueue,i=l.pending;if(i!==null){if(n!==null){var u=n.next;n.next=i.next,i.next=u}a.baseQueue=n=i,l.pending=null}if(i=t.baseState,n===null)t.memoizedState=i;else{a=n.next;var c=u=null,f=null,h=a,y=!1;do{var E=h.lane&-536870913;if(E!==h.lane?(F&E)===E:(La&E)===E){var m=h.revertLane;if(m===0)f!==null&&(f=f.next={lane:0,revertLane:0,gesture:null,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),E===cl&&(y=!0);else if((La&m)===m){h=h.next,m===cl&&(y=!0);continue}else E={lane:0,revertLane:h.revertLane,gesture:null,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null},f===null?(c=f=E,u=i):f=f.next=E,G.lanes|=m,se|=m;E=h.action,Ye&&e(i,E),i=h.hasEagerState?h.eagerState:e(i,E)}else m={lane:E,revertLane:h.revertLane,gesture:h.gesture,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null},f===null?(c=f=m,u=i):f=f.next=m,G.lanes|=E,se|=E;h=h.next}while(h!==null&&h!==a);if(f===null?u=i:f.next=c,!aa(i,t.memoizedState)&&(At=!0,y&&(e=rl,e!==null)))throw e;t.memoizedState=i,t.baseState=u,t.baseQueue=f,l.lastRenderedState=i}return n===null&&(l.lanes=0),[t.memoizedState,l.dispatch]}function Wu(t){var a=zt(),e=a.queue;if(e===null)throw Error(p(311));e.lastRenderedReducer=t;var l=e.dispatch,n=e.pending,i=a.memoizedState;if(n!==null){e.pending=null;var u=n=n.next;do i=t(i,u.action),u=u.next;while(u!==n);aa(i,a.memoizedState)||(At=!0),a.memoizedState=i,a.baseQueue===null&&(a.baseState=i),e.lastRenderedState=i}return[i,l]}function Lf(t,a,e){var l=G,n=zt(),i=I;if(i){if(e===void 0)throw Error(p(407));e=e()}else e=a();var u=!aa((ct||n).memoizedState,e);if(u&&(n.memoizedState=e,At=!0),n=n.queue,Pu(Xf.bind(null,l,n,t),[t]),n.getSnapshot!==a||u||Tt!==null&&Tt.memoizedState.tag&1){if(l.flags|=2048,gl(9,{destroy:void 0},Gf.bind(null,l,n,e,a),null),st===null)throw Error(p(349));i||(La&127)!==0||qf(l,a,e)}return e}function qf(t,a,e){t.flags|=16384,t={getSnapshot:a,value:e},a=G.updateQueue,a===null?(a=ei(),G.updateQueue=a,a.stores=[t]):(e=a.stores,e===null?a.stores=[t]:e.push(t))}function Gf(t,a,e,l){a.value=e,a.getSnapshot=l,Qf(a)&&Zf(t)}function Xf(t,a,e){return e(function(){Qf(a)&&Zf(t)})}function Qf(t){var a=t.getSnapshot;t=t.value;try{var e=a();return!aa(t,e)}catch{return!0}}function Zf(t){var a=Me(t,2);a!==null&&$t(a,t,2)}function $u(t){var a=Gt();if(typeof t=="function"){var e=t;if(t=e(),Ye){$a(!0);try{e()}finally{$a(!1)}}}return a.memoizedState=a.baseState=t,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:qa,lastRenderedState:t},a}function Vf(t,a,e,l){return t.baseState=e,Fu(t,ct,typeof l=="function"?l:qa)}function Fp(t,a,e,l,n){if(ci(t))throw Error(p(485));if(t=a.action,t!==null){var i={payload:n,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){i.listeners.push(u)}};b.T!==null?e(!0):i.isTransition=!1,l(i),e=a.pending,e===null?(i.next=a.pending=i,Kf(a,i)):(i.next=e.next,a.pending=e.next=i)}}function Kf(t,a){var e=a.action,l=a.payload,n=t.state;if(a.isTransition){var i=b.T,u={};b.T=u;try{var c=e(n,l),f=b.S;f!==null&&f(u,c),kf(t,a,c)}catch(h){Iu(t,a,h)}finally{i!==null&&u.types!==null&&(i.types=u.types),b.T=i}}else try{i=e(n,l),kf(t,a,i)}catch(h){Iu(t,a,h)}}function kf(t,a,e){e!==null&&typeof e=="object"&&typeof e.then=="function"?e.then(function(l){Jf(t,a,l)},function(l){return Iu(t,a,l)}):Jf(t,a,e)}function Jf(t,a,e){a.status="fulfilled",a.value=e,Ff(a),t.state=e,a=t.pending,a!==null&&(e=a.next,e===a?t.pending=null:(e=e.next,a.next=e,Kf(t,e)))}function Iu(t,a,e){var l=t.pending;if(t.pending=null,l!==null){l=l.next;do a.status="rejected",a.reason=e,Ff(a),a=a.next;while(a!==l)}t.action=null}function Ff(t){t=t.listeners;for(var a=0;a<t.length;a++)(0,t[a])()}function Wf(t,a){return a}function $f(t,a){if(I){var e=st.formState;if(e!==null){t:{var l=G;if(I){if(pt){a:{for(var n=pt,i=ma;n.nodeType!==8;){if(!i){n=null;break a}if(n=va(n.nextSibling),n===null){n=null;break a}}i=n.data,n=i==="F!"||i==="F"?n:null}if(n){pt=va(n.nextSibling),l=n.data==="F!";break t}}ee(l)}l=!1}l&&(a=e[0])}}return e=Gt(),e.memoizedState=e.baseState=a,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wf,lastRenderedState:a},e.queue=l,e=xo.bind(null,G,l),l.dispatch=e,l=$u(!1),i=nc.bind(null,G,!1,l.queue),l=Gt(),n={state:a,dispatch:null,action:t,pending:null},l.queue=n,e=Fp.bind(null,G,n,i,e),n.dispatch=e,l.memoizedState=t,[a,e,!1]}function If(t){var a=zt();return Pf(a,ct,t)}function Pf(t,a,e){if(a=Fu(t,a,Wf)[0],t=ni(qa)[0],typeof a=="object"&&a!==null&&typeof a.then=="function")try{var l=Il(a)}catch(u){throw u===fl?Jn:u}else l=a;a=zt();var n=a.queue,i=n.dispatch;return e!==a.memoizedState&&(G.flags|=2048,gl(9,{destroy:void 0},Wp.bind(null,n,e),null)),[l,i,t]}function Wp(t,a){t.action=a}function to(t){var a=zt(),e=ct;if(e!==null)return Pf(a,e,t);zt(),a=a.memoizedState,e=zt();var l=e.queue.dispatch;return e.memoizedState=t,[a,l,!1]}function gl(t,a,e,l){return t={tag:t,create:e,deps:l,inst:a,next:null},a=G.updateQueue,a===null&&(a=ei(),G.updateQueue=a),e=a.lastEffect,e===null?a.lastEffect=t.next=t:(l=e.next,e.next=t,t.next=l,a.lastEffect=t),t}function ao(){return zt().memoizedState}function ii(t,a,e,l){var n=Gt();G.flags|=t,n.memoizedState=gl(1|a,{destroy:void 0},e,l===void 0?null:l)}function ui(t,a,e,l){var n=zt();l=l===void 0?null:l;var i=n.memoizedState.inst;ct!==null&&l!==null&&Qu(l,ct.memoizedState.deps)?n.memoizedState=gl(a,i,e,l):(G.flags|=t,n.memoizedState=gl(1|a,i,e,l))}function eo(t,a){ii(8390656,8,t,a)}function Pu(t,a){ui(2048,8,t,a)}function $p(t){G.flags|=4;var a=G.updateQueue;if(a===null)a=ei(),G.updateQueue=a,a.events=[t];else{var e=a.events;e===null?a.events=[t]:e.push(t)}}function lo(t){var a=zt().memoizedState;return $p({ref:a,nextImpl:t}),function(){if((at&2)!==0)throw Error(p(440));return a.impl.apply(void 0,arguments)}}function no(t,a){return ui(4,2,t,a)}function io(t,a){return ui(4,4,t,a)}function uo(t,a){if(typeof a=="function"){t=t();var e=a(t);return function(){typeof e=="function"?e():a(null)}}if(a!=null)return t=t(),a.current=t,function(){a.current=null}}function co(t,a,e){e=e!=null?e.concat([t]):null,ui(4,4,uo.bind(null,a,t),e)}function tc(){}function ro(t,a){var e=zt();a=a===void 0?null:a;var l=e.memoizedState;return a!==null&&Qu(a,l[1])?l[0]:(e.memoizedState=[t,a],t)}function fo(t,a){var e=zt();a=a===void 0?null:a;var l=e.memoizedState;if(a!==null&&Qu(a,l[1]))return l[0];if(l=t(),Ye){$a(!0);try{t()}finally{$a(!1)}}return e.memoizedState=[l,a],l}function ac(t,a,e){return e===void 0||(La&1073741824)!==0&&(F&261930)===0?t.memoizedState=a:(t.memoizedState=e,t=ss(),G.lanes|=t,se|=t,e)}function oo(t,a,e,l){return aa(e,a)?e:sl.current!==null?(t=ac(t,e,l),aa(t,a)||(At=!0),t):(La&42)===0||(La&1073741824)!==0&&(F&261930)===0?(At=!0,t.memoizedState=e):(t=ss(),G.lanes|=t,se|=t,a)}function so(t,a,e,l,n){var i=N.p;N.p=i!==0&&8>i?i:8;var u=b.T,c={};b.T=c,nc(t,!1,a,e);try{var f=n(),h=b.S;if(h!==null&&h(c,f),f!==null&&typeof f=="object"&&typeof f.then=="function"){var y=Kp(f,l);Pl(t,a,y,ca(t))}else Pl(t,a,l,ca(t))}catch(E){Pl(t,a,{then:function(){},status:"rejected",reason:E},ca())}finally{N.p=i,u!==null&&c.types!==null&&(u.types=c.types),b.T=u}}function Ip(){}function ec(t,a,e,l){if(t.tag!==5)throw Error(p(476));var n=po(t).queue;so(t,n,a,Y,e===null?Ip:function(){return go(t),e(l)})}function po(t){var a=t.memoizedState;if(a!==null)return a;a={memoizedState:Y,baseState:Y,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qa,lastRenderedState:Y},next:null};var e={};return a.next={memoizedState:e,baseState:e,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qa,lastRenderedState:e},next:null},t.memoizedState=a,t=t.alternate,t!==null&&(t.memoizedState=a),a}function go(t){var a=po(t);a.next===null&&(a=t.alternate.memoizedState),Pl(t,a.next.queue,{},ca())}function lc(){return Ct(xn)}function ho(){return zt().memoizedState}function mo(){return zt().memoizedState}function Pp(t){for(var a=t.return;a!==null;){switch(a.tag){case 24:case 3:var e=ca();t=ie(e);var l=ue(a,t,e);l!==null&&($t(l,a,e),Jl(l,a,e)),a={cache:Du()},t.payload=a;return}a=a.return}}function tg(t,a,e){var l=ca();e={lane:l,revertLane:0,gesture:null,action:e,hasEagerState:!1,eagerState:null,next:null},ci(t)?vo(a,e):(e=Su(t,a,e,l),e!==null&&($t(e,t,l),yo(e,a,l)))}function xo(t,a,e){var l=ca();Pl(t,a,e,l)}function Pl(t,a,e,l){var n={lane:l,revertLane:0,gesture:null,action:e,hasEagerState:!1,eagerState:null,next:null};if(ci(t))vo(a,n);else{var i=t.alternate;if(t.lanes===0&&(i===null||i.lanes===0)&&(i=a.lastRenderedReducer,i!==null))try{var u=a.lastRenderedState,c=i(u,e);if(n.hasEagerState=!0,n.eagerState=c,aa(c,u))return Gn(t,a,n,0),st===null&&qn(),!1}catch{}finally{}if(e=Su(t,a,n,l),e!==null)return $t(e,t,l),yo(e,a,l),!0}return!1}function nc(t,a,e,l){if(l={lane:2,revertLane:Bc(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},ci(t)){if(a)throw Error(p(479))}else a=Su(t,e,l,2),a!==null&&$t(a,t,2)}function ci(t){var a=t.alternate;return t===G||a!==null&&a===G}function vo(t,a){dl=ti=!0;var e=t.pending;e===null?a.next=a:(a.next=e.next,e.next=a),t.pending=a}function yo(t,a,e){if((e&4194048)!==0){var l=a.lanes;l&=t.pendingLanes,e|=l,a.lanes=e,zr(t,e)}}var tn={readContext:Ct,use:li,useCallback:vt,useContext:vt,useEffect:vt,useImperativeHandle:vt,useLayoutEffect:vt,useInsertionEffect:vt,useMemo:vt,useReducer:vt,useRef:vt,useState:vt,useDebugValue:vt,useDeferredValue:vt,useTransition:vt,useSyncExternalStore:vt,useId:vt,useHostTransitionStatus:vt,useFormState:vt,useActionState:vt,useOptimistic:vt,useMemoCache:vt,useCacheRefresh:vt};tn.useEffectEvent=vt;var bo={readContext:Ct,use:li,useCallback:function(t,a){return Gt().memoizedState=[t,a===void 0?null:a],t},useContext:Ct,useEffect:eo,useImperativeHandle:function(t,a,e){e=e!=null?e.concat([t]):null,ii(4194308,4,uo.bind(null,a,t),e)},useLayoutEffect:function(t,a){return ii(4194308,4,t,a)},useInsertionEffect:function(t,a){ii(4,2,t,a)},useMemo:function(t,a){var e=Gt();a=a===void 0?null:a;var l=t();if(Ye){$a(!0);try{t()}finally{$a(!1)}}return e.memoizedState=[l,a],l},useReducer:function(t,a,e){var l=Gt();if(e!==void 0){var n=e(a);if(Ye){$a(!0);try{e(a)}finally{$a(!1)}}}else n=a;return l.memoizedState=l.baseState=n,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:n},l.queue=t,t=t.dispatch=tg.bind(null,G,t),[l.memoizedState,t]},useRef:function(t){var a=Gt();return t={current:t},a.memoizedState=t},useState:function(t){t=$u(t);var a=t.queue,e=xo.bind(null,G,a);return a.dispatch=e,[t.memoizedState,e]},useDebugValue:tc,useDeferredValue:function(t,a){var e=Gt();return ac(e,t,a)},useTransition:function(){var t=$u(!1);return t=so.bind(null,G,t.queue,!0,!1),Gt().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,a,e){var l=G,n=Gt();if(I){if(e===void 0)throw Error(p(407));e=e()}else{if(e=a(),st===null)throw Error(p(349));(F&127)!==0||qf(l,a,e)}n.memoizedState=e;var i={value:e,getSnapshot:a};return n.queue=i,eo(Xf.bind(null,l,i,t),[t]),l.flags|=2048,gl(9,{destroy:void 0},Gf.bind(null,l,i,e,a),null),e},useId:function(){var t=Gt(),a=st.identifierPrefix;if(I){var e=Oa,l=ja;e=(l&~(1<<32-ta(l)-1)).toString(32)+e,a="_"+a+"R_"+e,e=ai++,0<e&&(a+="H"+e.toString(32)),a+="_"}else e=kp++,a="_"+a+"r_"+e.toString(32)+"_";return t.memoizedState=a},useHostTransitionStatus:lc,useFormState:$f,useActionState:$f,useOptimistic:function(t){var a=Gt();a.memoizedState=a.baseState=t;var e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=e,a=nc.bind(null,G,!0,e),e.dispatch=a,[t,a]},useMemoCache:Ju,useCacheRefresh:function(){return Gt().memoizedState=Pp.bind(null,G)},useEffectEvent:function(t){var a=Gt(),e={impl:t};return a.memoizedState=e,function(){if((at&2)!==0)throw Error(p(440));return e.impl.apply(void 0,arguments)}}},ic={readContext:Ct,use:li,useCallback:ro,useContext:Ct,useEffect:Pu,useImperativeHandle:co,useInsertionEffect:no,useLayoutEffect:io,useMemo:fo,useReducer:ni,useRef:ao,useState:function(){return ni(qa)},useDebugValue:tc,useDeferredValue:function(t,a){var e=zt();return oo(e,ct.memoizedState,t,a)},useTransition:function(){var t=ni(qa)[0],a=zt().memoizedState;return[typeof t=="boolean"?t:Il(t),a]},useSyncExternalStore:Lf,useId:ho,useHostTransitionStatus:lc,useFormState:If,useActionState:If,useOptimistic:function(t,a){var e=zt();return Vf(e,ct,t,a)},useMemoCache:Ju,useCacheRefresh:mo};ic.useEffectEvent=lo;var So={readContext:Ct,use:li,useCallback:ro,useContext:Ct,useEffect:Pu,useImperativeHandle:co,useInsertionEffect:no,useLayoutEffect:io,useMemo:fo,useReducer:Wu,useRef:ao,useState:function(){return Wu(qa)},useDebugValue:tc,useDeferredValue:function(t,a){var e=zt();return ct===null?ac(e,t,a):oo(e,ct.memoizedState,t,a)},useTransition:function(){var t=Wu(qa)[0],a=zt().memoizedState;return[typeof t=="boolean"?t:Il(t),a]},useSyncExternalStore:Lf,useId:ho,useHostTransitionStatus:lc,useFormState:to,useActionState:to,useOptimistic:function(t,a){var e=zt();return ct!==null?Vf(e,ct,t,a):(e.baseState=t,[t,e.queue.dispatch])},useMemoCache:Ju,useCacheRefresh:mo};So.useEffectEvent=lo;function uc(t,a,e,l){a=t.memoizedState,e=e(l,a),e=e==null?a:U({},a,e),t.memoizedState=e,t.lanes===0&&(t.updateQueue.baseState=e)}var cc={enqueueSetState:function(t,a,e){t=t._reactInternals;var l=ca(),n=ie(l);n.payload=a,e!=null&&(n.callback=e),a=ue(t,n,l),a!==null&&($t(a,t,l),Jl(a,t,l))},enqueueReplaceState:function(t,a,e){t=t._reactInternals;var l=ca(),n=ie(l);n.tag=1,n.payload=a,e!=null&&(n.callback=e),a=ue(t,n,l),a!==null&&($t(a,t,l),Jl(a,t,l))},enqueueForceUpdate:function(t,a){t=t._reactInternals;var e=ca(),l=ie(e);l.tag=2,a!=null&&(l.callback=a),a=ue(t,l,e),a!==null&&($t(a,t,e),Jl(a,t,e))}};function zo(t,a,e,l,n,i,u){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,i,u):a.prototype&&a.prototype.isPureReactComponent?!ql(e,l)||!ql(n,i):!0}function Eo(t,a,e,l){t=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(e,l),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(e,l),a.state!==t&&cc.enqueueReplaceState(a,a.state,null)}function Le(t,a){var e=a;if("ref"in a){e={};for(var l in a)l!=="ref"&&(e[l]=a[l])}if(t=t.defaultProps){e===a&&(e=U({},e));for(var n in t)e[n]===void 0&&(e[n]=t[n])}return e}function To(t){Ln(t)}function Ao(t){console.error(t)}function No(t){Ln(t)}function ri(t,a){try{var e=t.onUncaughtError;e(a.value,{componentStack:a.stack})}catch(l){setTimeout(function(){throw l})}}function jo(t,a,e){try{var l=t.onCaughtError;l(e.value,{componentStack:e.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(n){setTimeout(function(){throw n})}}function rc(t,a,e){return e=ie(e),e.tag=3,e.payload={element:null},e.callback=function(){ri(t,a)},e}function Oo(t){return t=ie(t),t.tag=3,t}function Mo(t,a,e,l){var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var i=l.value;t.payload=function(){return n(i)},t.callback=function(){jo(a,e,l)}}var u=e.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(t.callback=function(){jo(a,e,l),typeof n!="function"&&(de===null?de=new Set([this]):de.add(this));var c=l.stack;this.componentDidCatch(l.value,{componentStack:c!==null?c:""})})}function ag(t,a,e,l,n){if(e.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(a=e.alternate,a!==null&&ul(a,e,n,!0),e=la.current,e!==null){switch(e.tag){case 31:case 13:return xa===null?bi():e.alternate===null&&yt===0&&(yt=3),e.flags&=-257,e.flags|=65536,e.lanes=n,l===Fn?e.flags|=16384:(a=e.updateQueue,a===null?e.updateQueue=new Set([l]):a.add(l),Cc(t,l,n)),!1;case 22:return e.flags|=65536,l===Fn?e.flags|=16384:(a=e.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([l])},e.updateQueue=a):(e=a.retryQueue,e===null?a.retryQueue=new Set([l]):e.add(l)),Cc(t,l,n)),!1}throw Error(p(435,e.tag))}return Cc(t,l,n),bi(),!1}if(I)return a=la.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=n,l!==ju&&(t=Error(p(422),{cause:l}),Ql(pa(t,e)))):(l!==ju&&(a=Error(p(423),{cause:l}),Ql(pa(a,e))),t=t.current.alternate,t.flags|=65536,n&=-n,t.lanes|=n,l=pa(l,e),n=rc(t.stateNode,l,n),Yu(t,n),yt!==4&&(yt=2)),!1;var i=Error(p(520),{cause:l});if(i=pa(i,e),fn===null?fn=[i]:fn.push(i),yt!==4&&(yt=2),a===null)return!0;l=pa(l,e),e=a;do{switch(e.tag){case 3:return e.flags|=65536,t=n&-n,e.lanes|=t,t=rc(e.stateNode,l,t),Yu(e,t),!1;case 1:if(a=e.type,i=e.stateNode,(e.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(de===null||!de.has(i))))return e.flags|=65536,n&=-n,e.lanes|=n,n=Oo(n),Mo(n,t,e,l),Yu(e,n),!1}e=e.return}while(e!==null);return!1}var fc=Error(p(461)),At=!1;function Rt(t,a,e,l){a.child=t===null?Df(a,null,e,l):He(a,t.child,e,l)}function wo(t,a,e,l,n){e=e.render;var i=a.ref;if("ref"in l){var u={};for(var c in l)c!=="ref"&&(u[c]=l[c])}else u=l;return Ce(a),l=Zu(t,a,e,u,i,n),c=Vu(),t!==null&&!At?(Ku(t,a,n),Ga(t,a,n)):(I&&c&&Au(a),a.flags|=1,Rt(t,a,l,n),a.child)}function _o(t,a,e,l,n){if(t===null){var i=e.type;return typeof i=="function"&&!zu(i)&&i.defaultProps===void 0&&e.compare===null?(a.tag=15,a.type=i,Do(t,a,i,l,n)):(t=Qn(e.type,null,l,a,a.mode,n),t.ref=a.ref,t.return=a,a.child=t)}if(i=t.child,!xc(t,n)){var u=i.memoizedProps;if(e=e.compare,e=e!==null?e:ql,e(u,l)&&t.ref===a.ref)return Ga(t,a,n)}return a.flags|=1,t=Ua(i,l),t.ref=a.ref,t.return=a,a.child=t}function Do(t,a,e,l,n){if(t!==null){var i=t.memoizedProps;if(ql(i,l)&&t.ref===a.ref)if(At=!1,a.pendingProps=l=i,xc(t,n))(t.flags&131072)!==0&&(At=!0);else return a.lanes=t.lanes,Ga(t,a,n)}return oc(t,a,e,l,n)}function Co(t,a,e,l){var n=l.children,i=t!==null?t.memoizedState:null;if(t===null&&a.stateNode===null&&(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((a.flags&128)!==0){if(i=i!==null?i.baseLanes|e:e,t!==null){for(l=a.child=t.child,n=0;l!==null;)n=n|l.lanes|l.childLanes,l=l.sibling;l=n&~i}else l=0,a.child=null;return Ro(t,a,i,e,l)}if((e&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},t!==null&&kn(a,i!==null?i.cachePool:null),i!==null?Uf(a,i):qu(),Bf(a);else return l=a.lanes=536870912,Ro(t,a,i!==null?i.baseLanes|e:e,e,l)}else i!==null?(kn(a,i.cachePool),Uf(a,i),re(),a.memoizedState=null):(t!==null&&kn(a,null),qu(),re());return Rt(t,a,n,e),a.child}function an(t,a){return t!==null&&t.tag===22||a.stateNode!==null||(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.sibling}function Ro(t,a,e,l,n){var i=Ru();return i=i===null?null:{parent:Et._currentValue,pool:i},a.memoizedState={baseLanes:e,cachePool:i},t!==null&&kn(a,null),qu(),Bf(a),t!==null&&ul(t,a,l,!0),a.childLanes=n,null}function fi(t,a){return a=si({mode:a.mode,children:a.children},t.mode),a.ref=t.ref,t.child=a,a.return=t,a}function Uo(t,a,e){return He(a,t.child,null,e),t=fi(a,a.pendingProps),t.flags|=2,na(a),a.memoizedState=null,t}function eg(t,a,e){var l=a.pendingProps,n=(a.flags&128)!==0;if(a.flags&=-129,t===null){if(I){if(l.mode==="hidden")return t=fi(a,l),a.lanes=536870912,an(null,t);if(Xu(a),(t=pt)?(t=ks(t,ma),t=t!==null&&t.data==="&"?t:null,t!==null&&(a.memoizedState={dehydrated:t,treeContext:te!==null?{id:ja,overflow:Oa}:null,retryLane:536870912,hydrationErrors:null},e=xf(t),e.return=a,a.child=e,Dt=a,pt=null)):t=null,t===null)throw ee(a);return a.lanes=536870912,null}return fi(a,l)}var i=t.memoizedState;if(i!==null){var u=i.dehydrated;if(Xu(a),n)if(a.flags&256)a.flags&=-257,a=Uo(t,a,e);else if(a.memoizedState!==null)a.child=t.child,a.flags|=128,a=null;else throw Error(p(558));else if(At||ul(t,a,e,!1),n=(e&t.childLanes)!==0,At||n){if(l=st,l!==null&&(u=Er(l,e),u!==0&&u!==i.retryLane))throw i.retryLane=u,Me(t,u),$t(l,t,u),fc;bi(),a=Uo(t,a,e)}else t=i.treeContext,pt=va(u.nextSibling),Dt=a,I=!0,ae=null,ma=!1,t!==null&&bf(a,t),a=fi(a,l),a.flags|=4096;return a}return t=Ua(t.child,{mode:l.mode,children:l.children}),t.ref=a.ref,a.child=t,t.return=a,t}function oi(t,a){var e=a.ref;if(e===null)t!==null&&t.ref!==null&&(a.flags|=4194816);else{if(typeof e!="function"&&typeof e!="object")throw Error(p(284));(t===null||t.ref!==e)&&(a.flags|=4194816)}}function oc(t,a,e,l,n){return Ce(a),e=Zu(t,a,e,l,void 0,n),l=Vu(),t!==null&&!At?(Ku(t,a,n),Ga(t,a,n)):(I&&l&&Au(a),a.flags|=1,Rt(t,a,e,n),a.child)}function Bo(t,a,e,l,n,i){return Ce(a),a.updateQueue=null,e=Yf(a,l,e,n),Hf(t),l=Vu(),t!==null&&!At?(Ku(t,a,i),Ga(t,a,i)):(I&&l&&Au(a),a.flags|=1,Rt(t,a,e,i),a.child)}function Ho(t,a,e,l,n){if(Ce(a),a.stateNode===null){var i=el,u=e.contextType;typeof u=="object"&&u!==null&&(i=Ct(u)),i=new e(l,i),a.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=cc,a.stateNode=i,i._reactInternals=a,i=a.stateNode,i.props=l,i.state=a.memoizedState,i.refs={},Bu(a),u=e.contextType,i.context=typeof u=="object"&&u!==null?Ct(u):el,i.state=a.memoizedState,u=e.getDerivedStateFromProps,typeof u=="function"&&(uc(a,e,u,l),i.state=a.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(u=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),u!==i.state&&cc.enqueueReplaceState(i,i.state,null),Wl(a,l,i,n),Fl(),i.state=a.memoizedState),typeof i.componentDidMount=="function"&&(a.flags|=4194308),l=!0}else if(t===null){i=a.stateNode;var c=a.memoizedProps,f=Le(e,c);i.props=f;var h=i.context,y=e.contextType;u=el,typeof y=="object"&&y!==null&&(u=Ct(y));var E=e.getDerivedStateFromProps;y=typeof E=="function"||typeof i.getSnapshotBeforeUpdate=="function",c=a.pendingProps!==c,y||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c||h!==u)&&Eo(a,i,l,u),ne=!1;var m=a.memoizedState;i.state=m,Wl(a,l,i,n),Fl(),h=a.memoizedState,c||m!==h||ne?(typeof E=="function"&&(uc(a,e,E,l),h=a.memoizedState),(f=ne||zo(a,e,f,l,m,h,u))?(y||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(a.flags|=4194308)):(typeof i.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=l,a.memoizedState=h),i.props=l,i.state=h,i.context=u,l=f):(typeof i.componentDidMount=="function"&&(a.flags|=4194308),l=!1)}else{i=a.stateNode,Hu(t,a),u=a.memoizedProps,y=Le(e,u),i.props=y,E=a.pendingProps,m=i.context,h=e.contextType,f=el,typeof h=="object"&&h!==null&&(f=Ct(h)),c=e.getDerivedStateFromProps,(h=typeof c=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(u!==E||m!==f)&&Eo(a,i,l,f),ne=!1,m=a.memoizedState,i.state=m,Wl(a,l,i,n),Fl();var v=a.memoizedState;u!==E||m!==v||ne||t!==null&&t.dependencies!==null&&Vn(t.dependencies)?(typeof c=="function"&&(uc(a,e,c,l),v=a.memoizedState),(y=ne||zo(a,e,y,l,m,v,f)||t!==null&&t.dependencies!==null&&Vn(t.dependencies))?(h||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,v,f),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,v,f)),typeof i.componentDidUpdate=="function"&&(a.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof i.componentDidUpdate!="function"||u===t.memoizedProps&&m===t.memoizedState||(a.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&m===t.memoizedState||(a.flags|=1024),a.memoizedProps=l,a.memoizedState=v),i.props=l,i.state=v,i.context=f,l=y):(typeof i.componentDidUpdate!="function"||u===t.memoizedProps&&m===t.memoizedState||(a.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&m===t.memoizedState||(a.flags|=1024),l=!1)}return i=l,oi(t,a),l=(a.flags&128)!==0,i||l?(i=a.stateNode,e=l&&typeof e.getDerivedStateFromError!="function"?null:i.render(),a.flags|=1,t!==null&&l?(a.child=He(a,t.child,null,n),a.child=He(a,null,e,n)):Rt(t,a,e,n),a.memoizedState=i.state,t=a.child):t=Ga(t,a,n),t}function Yo(t,a,e,l){return _e(),a.flags|=256,Rt(t,a,e,l),a.child}var sc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function dc(t){return{baseLanes:t,cachePool:Nf()}}function pc(t,a,e){return t=t!==null?t.childLanes&~e:0,a&&(t|=ua),t}function Lo(t,a,e){var l=a.pendingProps,n=!1,i=(a.flags&128)!==0,u;if((u=i)||(u=t!==null&&t.memoizedState===null?!1:(St.current&2)!==0),u&&(n=!0,a.flags&=-129),u=(a.flags&32)!==0,a.flags&=-33,t===null){if(I){if(n?ce(a):re(),(t=pt)?(t=ks(t,ma),t=t!==null&&t.data!=="&"?t:null,t!==null&&(a.memoizedState={dehydrated:t,treeContext:te!==null?{id:ja,overflow:Oa}:null,retryLane:536870912,hydrationErrors:null},e=xf(t),e.return=a,a.child=e,Dt=a,pt=null)):t=null,t===null)throw ee(a);return Fc(t)?a.lanes=32:a.lanes=536870912,null}var c=l.children;return l=l.fallback,n?(re(),n=a.mode,c=si({mode:"hidden",children:c},n),l=we(l,n,e,null),c.return=a,l.return=a,c.sibling=l,a.child=c,l=a.child,l.memoizedState=dc(e),l.childLanes=pc(t,u,e),a.memoizedState=sc,an(null,l)):(ce(a),gc(a,c))}var f=t.memoizedState;if(f!==null&&(c=f.dehydrated,c!==null)){if(i)a.flags&256?(ce(a),a.flags&=-257,a=hc(t,a,e)):a.memoizedState!==null?(re(),a.child=t.child,a.flags|=128,a=null):(re(),c=l.fallback,n=a.mode,l=si({mode:"visible",children:l.children},n),c=we(c,n,e,null),c.flags|=2,l.return=a,c.return=a,l.sibling=c,a.child=l,He(a,t.child,null,e),l=a.child,l.memoizedState=dc(e),l.childLanes=pc(t,u,e),a.memoizedState=sc,a=an(null,l));else if(ce(a),Fc(c)){if(u=c.nextSibling&&c.nextSibling.dataset,u)var h=u.dgst;u=h,l=Error(p(419)),l.stack="",l.digest=u,Ql({value:l,source:null,stack:null}),a=hc(t,a,e)}else if(At||ul(t,a,e,!1),u=(e&t.childLanes)!==0,At||u){if(u=st,u!==null&&(l=Er(u,e),l!==0&&l!==f.retryLane))throw f.retryLane=l,Me(t,l),$t(u,t,l),fc;Jc(c)||bi(),a=hc(t,a,e)}else Jc(c)?(a.flags|=192,a.child=t.child,a=null):(t=f.treeContext,pt=va(c.nextSibling),Dt=a,I=!0,ae=null,ma=!1,t!==null&&bf(a,t),a=gc(a,l.children),a.flags|=4096);return a}return n?(re(),c=l.fallback,n=a.mode,f=t.child,h=f.sibling,l=Ua(f,{mode:"hidden",children:l.children}),l.subtreeFlags=f.subtreeFlags&65011712,h!==null?c=Ua(h,c):(c=we(c,n,e,null),c.flags|=2),c.return=a,l.return=a,l.sibling=c,a.child=l,an(null,l),l=a.child,c=t.child.memoizedState,c===null?c=dc(e):(n=c.cachePool,n!==null?(f=Et._currentValue,n=n.parent!==f?{parent:f,pool:f}:n):n=Nf(),c={baseLanes:c.baseLanes|e,cachePool:n}),l.memoizedState=c,l.childLanes=pc(t,u,e),a.memoizedState=sc,an(t.child,l)):(ce(a),e=t.child,t=e.sibling,e=Ua(e,{mode:"visible",children:l.children}),e.return=a,e.sibling=null,t!==null&&(u=a.deletions,u===null?(a.deletions=[t],a.flags|=16):u.push(t)),a.child=e,a.memoizedState=null,e)}function gc(t,a){return a=si({mode:"visible",children:a},t.mode),a.return=t,t.child=a}function si(t,a){return t=ea(22,t,null,a),t.lanes=0,t}function hc(t,a,e){return He(a,t.child,null,e),t=gc(a,a.pendingProps.children),t.flags|=2,a.memoizedState=null,t}function qo(t,a,e){t.lanes|=a;var l=t.alternate;l!==null&&(l.lanes|=a),wu(t.return,a,e)}function mc(t,a,e,l,n,i){var u=t.memoizedState;u===null?t.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:l,tail:e,tailMode:n,treeForkCount:i}:(u.isBackwards=a,u.rendering=null,u.renderingStartTime=0,u.last=l,u.tail=e,u.tailMode=n,u.treeForkCount=i)}function Go(t,a,e){var l=a.pendingProps,n=l.revealOrder,i=l.tail;l=l.children;var u=St.current,c=(u&2)!==0;if(c?(u=u&1|2,a.flags|=128):u&=1,j(St,u),Rt(t,a,l,e),l=I?Xl:0,!c&&t!==null&&(t.flags&128)!==0)t:for(t=a.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&qo(t,e,a);else if(t.tag===19)qo(t,e,a);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===a)break t;for(;t.sibling===null;){if(t.return===null||t.return===a)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(n){case"forwards":for(e=a.child,n=null;e!==null;)t=e.alternate,t!==null&&Pn(t)===null&&(n=e),e=e.sibling;e=n,e===null?(n=a.child,a.child=null):(n=e.sibling,e.sibling=null),mc(a,!1,n,e,i,l);break;case"backwards":case"unstable_legacy-backwards":for(e=null,n=a.child,a.child=null;n!==null;){if(t=n.alternate,t!==null&&Pn(t)===null){a.child=n;break}t=n.sibling,n.sibling=e,e=n,n=t}mc(a,!0,e,null,i,l);break;case"together":mc(a,!1,null,null,void 0,l);break;default:a.memoizedState=null}return a.child}function Ga(t,a,e){if(t!==null&&(a.dependencies=t.dependencies),se|=a.lanes,(e&a.childLanes)===0)if(t!==null){if(ul(t,a,e,!1),(e&a.childLanes)===0)return null}else return null;if(t!==null&&a.child!==t.child)throw Error(p(153));if(a.child!==null){for(t=a.child,e=Ua(t,t.pendingProps),a.child=e,e.return=a;t.sibling!==null;)t=t.sibling,e=e.sibling=Ua(t,t.pendingProps),e.return=a;e.sibling=null}return a.child}function xc(t,a){return(t.lanes&a)!==0?!0:(t=t.dependencies,!!(t!==null&&Vn(t)))}function lg(t,a,e){switch(a.tag){case 3:qt(a,a.stateNode.containerInfo),le(a,Et,t.memoizedState.cache),_e();break;case 27:case 5:jl(a);break;case 4:qt(a,a.stateNode.containerInfo);break;case 10:le(a,a.type,a.memoizedProps.value);break;case 31:if(a.memoizedState!==null)return a.flags|=128,Xu(a),null;break;case 13:var l=a.memoizedState;if(l!==null)return l.dehydrated!==null?(ce(a),a.flags|=128,null):(e&a.child.childLanes)!==0?Lo(t,a,e):(ce(a),t=Ga(t,a,e),t!==null?t.sibling:null);ce(a);break;case 19:var n=(t.flags&128)!==0;if(l=(e&a.childLanes)!==0,l||(ul(t,a,e,!1),l=(e&a.childLanes)!==0),n){if(l)return Go(t,a,e);a.flags|=128}if(n=a.memoizedState,n!==null&&(n.rendering=null,n.tail=null,n.lastEffect=null),j(St,St.current),l)break;return null;case 22:return a.lanes=0,Co(t,a,e,a.pendingProps);case 24:le(a,Et,t.memoizedState.cache)}return Ga(t,a,e)}function Xo(t,a,e){if(t!==null)if(t.memoizedProps!==a.pendingProps)At=!0;else{if(!xc(t,e)&&(a.flags&128)===0)return At=!1,lg(t,a,e);At=(t.flags&131072)!==0}else At=!1,I&&(a.flags&1048576)!==0&&yf(a,Xl,a.index);switch(a.lanes=0,a.tag){case 16:t:{var l=a.pendingProps;if(t=Ue(a.elementType),a.type=t,typeof t=="function")zu(t)?(l=Le(t,l),a.tag=1,a=Ho(null,a,t,l,e)):(a.tag=0,a=oc(null,a,t,l,e));else{if(t!=null){var n=t.$$typeof;if(n===fa){a.tag=11,a=wo(null,a,t,l,e);break t}else if(n===$){a.tag=14,a=_o(null,a,t,l,e);break t}}throw a=_a(t)||t,Error(p(306,a,""))}}return a;case 0:return oc(t,a,a.type,a.pendingProps,e);case 1:return l=a.type,n=Le(l,a.pendingProps),Ho(t,a,l,n,e);case 3:t:{if(qt(a,a.stateNode.containerInfo),t===null)throw Error(p(387));l=a.pendingProps;var i=a.memoizedState;n=i.element,Hu(t,a),Wl(a,l,null,e);var u=a.memoizedState;if(l=u.cache,le(a,Et,l),l!==i.cache&&_u(a,[Et],e,!0),Fl(),l=u.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:u.cache},a.updateQueue.baseState=i,a.memoizedState=i,a.flags&256){a=Yo(t,a,l,e);break t}else if(l!==n){n=pa(Error(p(424)),a),Ql(n),a=Yo(t,a,l,e);break t}else{switch(t=a.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(pt=va(t.firstChild),Dt=a,I=!0,ae=null,ma=!0,e=Df(a,null,l,e),a.child=e;e;)e.flags=e.flags&-3|4096,e=e.sibling}else{if(_e(),l===n){a=Ga(t,a,e);break t}Rt(t,a,l,e)}a=a.child}return a;case 26:return oi(t,a),t===null?(e=Ps(a.type,null,a.pendingProps,null))?a.memoizedState=e:I||(e=a.type,t=a.pendingProps,l=ji(Z.current).createElement(e),l[_t]=a,l[Vt]=t,Ut(l,e,t),Ot(l),a.stateNode=l):a.memoizedState=Ps(a.type,t.memoizedProps,a.pendingProps,t.memoizedState),null;case 27:return jl(a),t===null&&I&&(l=a.stateNode=Ws(a.type,a.pendingProps,Z.current),Dt=a,ma=!0,n=pt,me(a.type)?(Wc=n,pt=va(l.firstChild)):pt=n),Rt(t,a,a.pendingProps.children,e),oi(t,a),t===null&&(a.flags|=4194304),a.child;case 5:return t===null&&I&&((n=l=pt)&&(l=Cg(l,a.type,a.pendingProps,ma),l!==null?(a.stateNode=l,Dt=a,pt=va(l.firstChild),ma=!1,n=!0):n=!1),n||ee(a)),jl(a),n=a.type,i=a.pendingProps,u=t!==null?t.memoizedProps:null,l=i.children,Vc(n,i)?l=null:u!==null&&Vc(n,u)&&(a.flags|=32),a.memoizedState!==null&&(n=Zu(t,a,Jp,null,null,e),xn._currentValue=n),oi(t,a),Rt(t,a,l,e),a.child;case 6:return t===null&&I&&((t=e=pt)&&(e=Rg(e,a.pendingProps,ma),e!==null?(a.stateNode=e,Dt=a,pt=null,t=!0):t=!1),t||ee(a)),null;case 13:return Lo(t,a,e);case 4:return qt(a,a.stateNode.containerInfo),l=a.pendingProps,t===null?a.child=He(a,null,l,e):Rt(t,a,l,e),a.child;case 11:return wo(t,a,a.type,a.pendingProps,e);case 7:return Rt(t,a,a.pendingProps,e),a.child;case 8:return Rt(t,a,a.pendingProps.children,e),a.child;case 12:return Rt(t,a,a.pendingProps.children,e),a.child;case 10:return l=a.pendingProps,le(a,a.type,l.value),Rt(t,a,l.children,e),a.child;case 9:return n=a.type._context,l=a.pendingProps.children,Ce(a),n=Ct(n),l=l(n),a.flags|=1,Rt(t,a,l,e),a.child;case 14:return _o(t,a,a.type,a.pendingProps,e);case 15:return Do(t,a,a.type,a.pendingProps,e);case 19:return Go(t,a,e);case 31:return eg(t,a,e);case 22:return Co(t,a,e,a.pendingProps);case 24:return Ce(a),l=Ct(Et),t===null?(n=Ru(),n===null&&(n=st,i=Du(),n.pooledCache=i,i.refCount++,i!==null&&(n.pooledCacheLanes|=e),n=i),a.memoizedState={parent:l,cache:n},Bu(a),le(a,Et,n)):((t.lanes&e)!==0&&(Hu(t,a),Wl(a,null,null,e),Fl()),n=t.memoizedState,i=a.memoizedState,n.parent!==l?(n={parent:l,cache:l},a.memoizedState=n,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=n),le(a,Et,l)):(l=i.cache,le(a,Et,l),l!==n.cache&&_u(a,[Et],e,!0))),Rt(t,a,a.pendingProps.children,e),a.child;case 29:throw a.pendingProps}throw Error(p(156,a.tag))}function Xa(t){t.flags|=4}function vc(t,a,e,l,n){if((a=(t.mode&32)!==0)&&(a=!1),a){if(t.flags|=16777216,(n&335544128)===n)if(t.stateNode.complete)t.flags|=8192;else if(hs())t.flags|=8192;else throw Be=Fn,Uu}else t.flags&=-16777217}function Qo(t,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!nd(a))if(hs())t.flags|=8192;else throw Be=Fn,Uu}function di(t,a){a!==null&&(t.flags|=4),t.flags&16384&&(a=t.tag!==22?br():536870912,t.lanes|=a,vl|=a)}function en(t,a){if(!I)switch(t.tailMode){case"hidden":a=t.tail;for(var e=null;a!==null;)a.alternate!==null&&(e=a),a=a.sibling;e===null?t.tail=null:e.sibling=null;break;case"collapsed":e=t.tail;for(var l=null;e!==null;)e.alternate!==null&&(l=e),e=e.sibling;l===null?a||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function gt(t){var a=t.alternate!==null&&t.alternate.child===t.child,e=0,l=0;if(a)for(var n=t.child;n!==null;)e|=n.lanes|n.childLanes,l|=n.subtreeFlags&65011712,l|=n.flags&65011712,n.return=t,n=n.sibling;else for(n=t.child;n!==null;)e|=n.lanes|n.childLanes,l|=n.subtreeFlags,l|=n.flags,n.return=t,n=n.sibling;return t.subtreeFlags|=l,t.childLanes=e,a}function ng(t,a,e){var l=a.pendingProps;switch(Nu(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return gt(a),null;case 1:return gt(a),null;case 3:return e=a.stateNode,l=null,t!==null&&(l=t.memoizedState.cache),a.memoizedState.cache!==l&&(a.flags|=2048),Ya(Et),bt(),e.pendingContext&&(e.context=e.pendingContext,e.pendingContext=null),(t===null||t.child===null)&&(il(a)?Xa(a):t===null||t.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,Ou())),gt(a),null;case 26:var n=a.type,i=a.memoizedState;return t===null?(Xa(a),i!==null?(gt(a),Qo(a,i)):(gt(a),vc(a,n,null,l,e))):i?i!==t.memoizedState?(Xa(a),gt(a),Qo(a,i)):(gt(a),a.flags&=-16777217):(t=t.memoizedProps,t!==l&&Xa(a),gt(a),vc(a,n,t,l,e)),null;case 27:if(En(a),e=Z.current,n=a.type,t!==null&&a.stateNode!=null)t.memoizedProps!==l&&Xa(a);else{if(!l){if(a.stateNode===null)throw Error(p(166));return gt(a),null}t=w.current,il(a)?Sf(a):(t=Ws(n,l,e),a.stateNode=t,Xa(a))}return gt(a),null;case 5:if(En(a),n=a.type,t!==null&&a.stateNode!=null)t.memoizedProps!==l&&Xa(a);else{if(!l){if(a.stateNode===null)throw Error(p(166));return gt(a),null}if(i=w.current,il(a))Sf(a);else{var u=ji(Z.current);switch(i){case 1:i=u.createElementNS("http://www.w3.org/2000/svg",n);break;case 2:i=u.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;default:switch(n){case"svg":i=u.createElementNS("http://www.w3.org/2000/svg",n);break;case"math":i=u.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;case"script":i=u.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?u.createElement("select",{is:l.is}):u.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?u.createElement(n,{is:l.is}):u.createElement(n)}}i[_t]=a,i[Vt]=l;t:for(u=a.child;u!==null;){if(u.tag===5||u.tag===6)i.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===a)break t;for(;u.sibling===null;){if(u.return===null||u.return===a)break t;u=u.return}u.sibling.return=u.return,u=u.sibling}a.stateNode=i;t:switch(Ut(i,n,l),n){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break t;case"img":l=!0;break t;default:l=!1}l&&Xa(a)}}return gt(a),vc(a,a.type,t===null?null:t.memoizedProps,a.pendingProps,e),null;case 6:if(t&&a.stateNode!=null)t.memoizedProps!==l&&Xa(a);else{if(typeof l!="string"&&a.stateNode===null)throw Error(p(166));if(t=Z.current,il(a)){if(t=a.stateNode,e=a.memoizedProps,l=null,n=Dt,n!==null)switch(n.tag){case 27:case 5:l=n.memoizedProps}t[_t]=a,t=!!(t.nodeValue===e||l!==null&&l.suppressHydrationWarning===!0||Ls(t.nodeValue,e)),t||ee(a,!0)}else t=ji(t).createTextNode(l),t[_t]=a,a.stateNode=t}return gt(a),null;case 31:if(e=a.memoizedState,t===null||t.memoizedState!==null){if(l=il(a),e!==null){if(t===null){if(!l)throw Error(p(318));if(t=a.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(p(557));t[_t]=a}else _e(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;gt(a),t=!1}else e=Ou(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=e),t=!0;if(!t)return a.flags&256?(na(a),a):(na(a),null);if((a.flags&128)!==0)throw Error(p(558))}return gt(a),null;case 13:if(l=a.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(n=il(a),l!==null&&l.dehydrated!==null){if(t===null){if(!n)throw Error(p(318));if(n=a.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(p(317));n[_t]=a}else _e(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;gt(a),n=!1}else n=Ou(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=n),n=!0;if(!n)return a.flags&256?(na(a),a):(na(a),null)}return na(a),(a.flags&128)!==0?(a.lanes=e,a):(e=l!==null,t=t!==null&&t.memoizedState!==null,e&&(l=a.child,n=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(n=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==n&&(l.flags|=2048)),e!==t&&e&&(a.child.flags|=8192),di(a,a.updateQueue),gt(a),null);case 4:return bt(),t===null&&qc(a.stateNode.containerInfo),gt(a),null;case 10:return Ya(a.type),gt(a),null;case 19:if(T(St),l=a.memoizedState,l===null)return gt(a),null;if(n=(a.flags&128)!==0,i=l.rendering,i===null)if(n)en(l,!1);else{if(yt!==0||t!==null&&(t.flags&128)!==0)for(t=a.child;t!==null;){if(i=Pn(t),i!==null){for(a.flags|=128,en(l,!1),t=i.updateQueue,a.updateQueue=t,di(a,t),a.subtreeFlags=0,t=e,e=a.child;e!==null;)mf(e,t),e=e.sibling;return j(St,St.current&1|2),I&&Ba(a,l.treeForkCount),a.child}t=t.sibling}l.tail!==null&&It()>xi&&(a.flags|=128,n=!0,en(l,!1),a.lanes=4194304)}else{if(!n)if(t=Pn(i),t!==null){if(a.flags|=128,n=!0,t=t.updateQueue,a.updateQueue=t,di(a,t),en(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!I)return gt(a),null}else 2*It()-l.renderingStartTime>xi&&e!==536870912&&(a.flags|=128,n=!0,en(l,!1),a.lanes=4194304);l.isBackwards?(i.sibling=a.child,a.child=i):(t=l.last,t!==null?t.sibling=i:a.child=i,l.last=i)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=It(),t.sibling=null,e=St.current,j(St,n?e&1|2:e&1),I&&Ba(a,l.treeForkCount),t):(gt(a),null);case 22:case 23:return na(a),Gu(),l=a.memoizedState!==null,t!==null?t.memoizedState!==null!==l&&(a.flags|=8192):l&&(a.flags|=8192),l?(e&536870912)!==0&&(a.flags&128)===0&&(gt(a),a.subtreeFlags&6&&(a.flags|=8192)):gt(a),e=a.updateQueue,e!==null&&di(a,e.retryQueue),e=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==e&&(a.flags|=2048),t!==null&&T(Re),null;case 24:return e=null,t!==null&&(e=t.memoizedState.cache),a.memoizedState.cache!==e&&(a.flags|=2048),Ya(Et),gt(a),null;case 25:return null;case 30:return null}throw Error(p(156,a.tag))}function ig(t,a){switch(Nu(a),a.tag){case 1:return t=a.flags,t&65536?(a.flags=t&-65537|128,a):null;case 3:return Ya(Et),bt(),t=a.flags,(t&65536)!==0&&(t&128)===0?(a.flags=t&-65537|128,a):null;case 26:case 27:case 5:return En(a),null;case 31:if(a.memoizedState!==null){if(na(a),a.alternate===null)throw Error(p(340));_e()}return t=a.flags,t&65536?(a.flags=t&-65537|128,a):null;case 13:if(na(a),t=a.memoizedState,t!==null&&t.dehydrated!==null){if(a.alternate===null)throw Error(p(340));_e()}return t=a.flags,t&65536?(a.flags=t&-65537|128,a):null;case 19:return T(St),null;case 4:return bt(),null;case 10:return Ya(a.type),null;case 22:case 23:return na(a),Gu(),t!==null&&T(Re),t=a.flags,t&65536?(a.flags=t&-65537|128,a):null;case 24:return Ya(Et),null;case 25:return null;default:return null}}function Zo(t,a){switch(Nu(a),a.tag){case 3:Ya(Et),bt();break;case 26:case 27:case 5:En(a);break;case 4:bt();break;case 31:a.memoizedState!==null&&na(a);break;case 13:na(a);break;case 19:T(St);break;case 10:Ya(a.type);break;case 22:case 23:na(a),Gu(),t!==null&&T(Re);break;case 24:Ya(Et)}}function ln(t,a){try{var e=a.updateQueue,l=e!==null?e.lastEffect:null;if(l!==null){var n=l.next;e=n;do{if((e.tag&t)===t){l=void 0;var i=e.create,u=e.inst;l=i(),u.destroy=l}e=e.next}while(e!==n)}}catch(c){it(a,a.return,c)}}function fe(t,a,e){try{var l=a.updateQueue,n=l!==null?l.lastEffect:null;if(n!==null){var i=n.next;l=i;do{if((l.tag&t)===t){var u=l.inst,c=u.destroy;if(c!==void 0){u.destroy=void 0,n=a;var f=e,h=c;try{h()}catch(y){it(n,f,y)}}}l=l.next}while(l!==i)}}catch(y){it(a,a.return,y)}}function Vo(t){var a=t.updateQueue;if(a!==null){var e=t.stateNode;try{Rf(a,e)}catch(l){it(t,t.return,l)}}}function Ko(t,a,e){e.props=Le(t.type,t.memoizedProps),e.state=t.memoizedState;try{e.componentWillUnmount()}catch(l){it(t,a,l)}}function nn(t,a){try{var e=t.ref;if(e!==null){switch(t.tag){case 26:case 27:case 5:var l=t.stateNode;break;case 30:l=t.stateNode;break;default:l=t.stateNode}typeof e=="function"?t.refCleanup=e(l):e.current=l}}catch(n){it(t,a,n)}}function Ma(t,a){var e=t.ref,l=t.refCleanup;if(e!==null)if(typeof l=="function")try{l()}catch(n){it(t,a,n)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof e=="function")try{e(null)}catch(n){it(t,a,n)}else e.current=null}function ko(t){var a=t.type,e=t.memoizedProps,l=t.stateNode;try{t:switch(a){case"button":case"input":case"select":case"textarea":e.autoFocus&&l.focus();break t;case"img":e.src?l.src=e.src:e.srcSet&&(l.srcset=e.srcSet)}}catch(n){it(t,t.return,n)}}function yc(t,a,e){try{var l=t.stateNode;jg(l,t.type,e,a),l[Vt]=a}catch(n){it(t,t.return,n)}}function Jo(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&me(t.type)||t.tag===4}function bc(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Jo(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&me(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Sc(t,a,e){var l=t.tag;if(l===5||l===6)t=t.stateNode,a?(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e).insertBefore(t,a):(a=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.appendChild(t),e=e._reactRootContainer,e!=null||a.onclick!==null||(a.onclick=Ca));else if(l!==4&&(l===27&&me(t.type)&&(e=t.stateNode,a=null),t=t.child,t!==null))for(Sc(t,a,e),t=t.sibling;t!==null;)Sc(t,a,e),t=t.sibling}function pi(t,a,e){var l=t.tag;if(l===5||l===6)t=t.stateNode,a?e.insertBefore(t,a):e.appendChild(t);else if(l!==4&&(l===27&&me(t.type)&&(e=t.stateNode),t=t.child,t!==null))for(pi(t,a,e),t=t.sibling;t!==null;)pi(t,a,e),t=t.sibling}function Fo(t){var a=t.stateNode,e=t.memoizedProps;try{for(var l=t.type,n=a.attributes;n.length;)a.removeAttributeNode(n[0]);Ut(a,l,e),a[_t]=t,a[Vt]=e}catch(i){it(t,t.return,i)}}var Qa=!1,Nt=!1,zc=!1,Wo=typeof WeakSet=="function"?WeakSet:Set,Mt=null;function ug(t,a){if(t=t.containerInfo,Qc=Ri,t=cf(t),hu(t)){if("selectionStart"in t)var e={start:t.selectionStart,end:t.selectionEnd};else t:{e=(e=t.ownerDocument)&&e.defaultView||window;var l=e.getSelection&&e.getSelection();if(l&&l.rangeCount!==0){e=l.anchorNode;var n=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{e.nodeType,i.nodeType}catch{e=null;break t}var u=0,c=-1,f=-1,h=0,y=0,E=t,m=null;a:for(;;){for(var v;E!==e||n!==0&&E.nodeType!==3||(c=u+n),E!==i||l!==0&&E.nodeType!==3||(f=u+l),E.nodeType===3&&(u+=E.nodeValue.length),(v=E.firstChild)!==null;)m=E,E=v;for(;;){if(E===t)break a;if(m===e&&++h===n&&(c=u),m===i&&++y===l&&(f=u),(v=E.nextSibling)!==null)break;E=m,m=E.parentNode}E=v}e=c===-1||f===-1?null:{start:c,end:f}}else e=null}e=e||{start:0,end:0}}else e=null;for(Zc={focusedElem:t,selectionRange:e},Ri=!1,Mt=a;Mt!==null;)if(a=Mt,t=a.child,(a.subtreeFlags&1028)!==0&&t!==null)t.return=a,Mt=t;else for(;Mt!==null;){switch(a=Mt,i=a.alternate,t=a.flags,a.tag){case 0:if((t&4)!==0&&(t=a.updateQueue,t=t!==null?t.events:null,t!==null))for(e=0;e<t.length;e++)n=t[e],n.ref.impl=n.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&i!==null){t=void 0,e=a,n=i.memoizedProps,i=i.memoizedState,l=e.stateNode;try{var M=Le(e.type,n);t=l.getSnapshotBeforeUpdate(M,i),l.__reactInternalSnapshotBeforeUpdate=t}catch(B){it(e,e.return,B)}}break;case 3:if((t&1024)!==0){if(t=a.stateNode.containerInfo,e=t.nodeType,e===9)kc(t);else if(e===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":kc(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(p(163))}if(t=a.sibling,t!==null){t.return=a.return,Mt=t;break}Mt=a.return}}function $o(t,a,e){var l=e.flags;switch(e.tag){case 0:case 11:case 15:Va(t,e),l&4&&ln(5,e);break;case 1:if(Va(t,e),l&4)if(t=e.stateNode,a===null)try{t.componentDidMount()}catch(u){it(e,e.return,u)}else{var n=Le(e.type,a.memoizedProps);a=a.memoizedState;try{t.componentDidUpdate(n,a,t.__reactInternalSnapshotBeforeUpdate)}catch(u){it(e,e.return,u)}}l&64&&Vo(e),l&512&&nn(e,e.return);break;case 3:if(Va(t,e),l&64&&(t=e.updateQueue,t!==null)){if(a=null,e.child!==null)switch(e.child.tag){case 27:case 5:a=e.child.stateNode;break;case 1:a=e.child.stateNode}try{Rf(t,a)}catch(u){it(e,e.return,u)}}break;case 27:a===null&&l&4&&Fo(e);case 26:case 5:Va(t,e),a===null&&l&4&&ko(e),l&512&&nn(e,e.return);break;case 12:Va(t,e);break;case 31:Va(t,e),l&4&&ts(t,e);break;case 13:Va(t,e),l&4&&as(t,e),l&64&&(t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(e=hg.bind(null,e),Ug(t,e))));break;case 22:if(l=e.memoizedState!==null||Qa,!l){a=a!==null&&a.memoizedState!==null||Nt,n=Qa;var i=Nt;Qa=l,(Nt=a)&&!i?Ka(t,e,(e.subtreeFlags&8772)!==0):Va(t,e),Qa=n,Nt=i}break;case 30:break;default:Va(t,e)}}function Io(t){var a=t.alternate;a!==null&&(t.alternate=null,Io(a)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(a=t.stateNode,a!==null&&Ii(a)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var mt=null,kt=!1;function Za(t,a,e){for(e=e.child;e!==null;)Po(t,a,e),e=e.sibling}function Po(t,a,e){if(Pt&&typeof Pt.onCommitFiberUnmount=="function")try{Pt.onCommitFiberUnmount(Ol,e)}catch{}switch(e.tag){case 26:Nt||Ma(e,a),Za(t,a,e),e.memoizedState?e.memoizedState.count--:e.stateNode&&(e=e.stateNode,e.parentNode.removeChild(e));break;case 27:Nt||Ma(e,a);var l=mt,n=kt;me(e.type)&&(mt=e.stateNode,kt=!1),Za(t,a,e),gn(e.stateNode),mt=l,kt=n;break;case 5:Nt||Ma(e,a);case 6:if(l=mt,n=kt,mt=null,Za(t,a,e),mt=l,kt=n,mt!==null)if(kt)try{(mt.nodeType===9?mt.body:mt.nodeName==="HTML"?mt.ownerDocument.body:mt).removeChild(e.stateNode)}catch(i){it(e,a,i)}else try{mt.removeChild(e.stateNode)}catch(i){it(e,a,i)}break;case 18:mt!==null&&(kt?(t=mt,Vs(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,e.stateNode),Nl(t)):Vs(mt,e.stateNode));break;case 4:l=mt,n=kt,mt=e.stateNode.containerInfo,kt=!0,Za(t,a,e),mt=l,kt=n;break;case 0:case 11:case 14:case 15:fe(2,e,a),Nt||fe(4,e,a),Za(t,a,e);break;case 1:Nt||(Ma(e,a),l=e.stateNode,typeof l.componentWillUnmount=="function"&&Ko(e,a,l)),Za(t,a,e);break;case 21:Za(t,a,e);break;case 22:Nt=(l=Nt)||e.memoizedState!==null,Za(t,a,e),Nt=l;break;default:Za(t,a,e)}}function ts(t,a){if(a.memoizedState===null&&(t=a.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Nl(t)}catch(e){it(a,a.return,e)}}}function as(t,a){if(a.memoizedState===null&&(t=a.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Nl(t)}catch(e){it(a,a.return,e)}}function cg(t){switch(t.tag){case 31:case 13:case 19:var a=t.stateNode;return a===null&&(a=t.stateNode=new Wo),a;case 22:return t=t.stateNode,a=t._retryCache,a===null&&(a=t._retryCache=new Wo),a;default:throw Error(p(435,t.tag))}}function gi(t,a){var e=cg(t);a.forEach(function(l){if(!e.has(l)){e.add(l);var n=mg.bind(null,t,l);l.then(n,n)}})}function Jt(t,a){var e=a.deletions;if(e!==null)for(var l=0;l<e.length;l++){var n=e[l],i=t,u=a,c=u;t:for(;c!==null;){switch(c.tag){case 27:if(me(c.type)){mt=c.stateNode,kt=!1;break t}break;case 5:mt=c.stateNode,kt=!1;break t;case 3:case 4:mt=c.stateNode.containerInfo,kt=!0;break t}c=c.return}if(mt===null)throw Error(p(160));Po(i,u,n),mt=null,kt=!1,i=n.alternate,i!==null&&(i.return=null),n.return=null}if(a.subtreeFlags&13886)for(a=a.child;a!==null;)es(a,t),a=a.sibling}var za=null;function es(t,a){var e=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Jt(a,t),Ft(t),l&4&&(fe(3,t,t.return),ln(3,t),fe(5,t,t.return));break;case 1:Jt(a,t),Ft(t),l&512&&(Nt||e===null||Ma(e,e.return)),l&64&&Qa&&(t=t.updateQueue,t!==null&&(l=t.callbacks,l!==null&&(e=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=e===null?l:e.concat(l))));break;case 26:var n=za;if(Jt(a,t),Ft(t),l&512&&(Nt||e===null||Ma(e,e.return)),l&4){var i=e!==null?e.memoizedState:null;if(l=t.memoizedState,e===null)if(l===null)if(t.stateNode===null){t:{l=t.type,e=t.memoizedProps,n=n.ownerDocument||n;a:switch(l){case"title":i=n.getElementsByTagName("title")[0],(!i||i[_l]||i[_t]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=n.createElement(l),n.head.insertBefore(i,n.querySelector("head > title"))),Ut(i,l,e),i[_t]=t,Ot(i),l=i;break t;case"link":var u=ed("link","href",n).get(l+(e.href||""));if(u){for(var c=0;c<u.length;c++)if(i=u[c],i.getAttribute("href")===(e.href==null||e.href===""?null:e.href)&&i.getAttribute("rel")===(e.rel==null?null:e.rel)&&i.getAttribute("title")===(e.title==null?null:e.title)&&i.getAttribute("crossorigin")===(e.crossOrigin==null?null:e.crossOrigin)){u.splice(c,1);break a}}i=n.createElement(l),Ut(i,l,e),n.head.appendChild(i);break;case"meta":if(u=ed("meta","content",n).get(l+(e.content||""))){for(c=0;c<u.length;c++)if(i=u[c],i.getAttribute("content")===(e.content==null?null:""+e.content)&&i.getAttribute("name")===(e.name==null?null:e.name)&&i.getAttribute("property")===(e.property==null?null:e.property)&&i.getAttribute("http-equiv")===(e.httpEquiv==null?null:e.httpEquiv)&&i.getAttribute("charset")===(e.charSet==null?null:e.charSet)){u.splice(c,1);break a}}i=n.createElement(l),Ut(i,l,e),n.head.appendChild(i);break;default:throw Error(p(468,l))}i[_t]=t,Ot(i),l=i}t.stateNode=l}else ld(n,t.type,t.stateNode);else t.stateNode=ad(n,l,t.memoizedProps);else i!==l?(i===null?e.stateNode!==null&&(e=e.stateNode,e.parentNode.removeChild(e)):i.count--,l===null?ld(n,t.type,t.stateNode):ad(n,l,t.memoizedProps)):l===null&&t.stateNode!==null&&yc(t,t.memoizedProps,e.memoizedProps)}break;case 27:Jt(a,t),Ft(t),l&512&&(Nt||e===null||Ma(e,e.return)),e!==null&&l&4&&yc(t,t.memoizedProps,e.memoizedProps);break;case 5:if(Jt(a,t),Ft(t),l&512&&(Nt||e===null||Ma(e,e.return)),t.flags&32){n=t.stateNode;try{Fe(n,"")}catch(M){it(t,t.return,M)}}l&4&&t.stateNode!=null&&(n=t.memoizedProps,yc(t,n,e!==null?e.memoizedProps:n)),l&1024&&(zc=!0);break;case 6:if(Jt(a,t),Ft(t),l&4){if(t.stateNode===null)throw Error(p(162));l=t.memoizedProps,e=t.stateNode;try{e.nodeValue=l}catch(M){it(t,t.return,M)}}break;case 3:if(wi=null,n=za,za=Oi(a.containerInfo),Jt(a,t),za=n,Ft(t),l&4&&e!==null&&e.memoizedState.isDehydrated)try{Nl(a.containerInfo)}catch(M){it(t,t.return,M)}zc&&(zc=!1,ls(t));break;case 4:l=za,za=Oi(t.stateNode.containerInfo),Jt(a,t),Ft(t),za=l;break;case 12:Jt(a,t),Ft(t);break;case 31:Jt(a,t),Ft(t),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,gi(t,l)));break;case 13:Jt(a,t),Ft(t),t.child.flags&8192&&t.memoizedState!==null!=(e!==null&&e.memoizedState!==null)&&(mi=It()),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,gi(t,l)));break;case 22:n=t.memoizedState!==null;var f=e!==null&&e.memoizedState!==null,h=Qa,y=Nt;if(Qa=h||n,Nt=y||f,Jt(a,t),Nt=y,Qa=h,Ft(t),l&8192)t:for(a=t.stateNode,a._visibility=n?a._visibility&-2:a._visibility|1,n&&(e===null||f||Qa||Nt||qe(t)),e=null,a=t;;){if(a.tag===5||a.tag===26){if(e===null){f=e=a;try{if(i=f.stateNode,n)u=i.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{c=f.stateNode;var E=f.memoizedProps.style,m=E!=null&&E.hasOwnProperty("display")?E.display:null;c.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(M){it(f,f.return,M)}}}else if(a.tag===6){if(e===null){f=a;try{f.stateNode.nodeValue=n?"":f.memoizedProps}catch(M){it(f,f.return,M)}}}else if(a.tag===18){if(e===null){f=a;try{var v=f.stateNode;n?Ks(v,!0):Ks(f.stateNode,!1)}catch(M){it(f,f.return,M)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===t)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break t;for(;a.sibling===null;){if(a.return===null||a.return===t)break t;e===a&&(e=null),a=a.return}e===a&&(e=null),a.sibling.return=a.return,a=a.sibling}l&4&&(l=t.updateQueue,l!==null&&(e=l.retryQueue,e!==null&&(l.retryQueue=null,gi(t,e))));break;case 19:Jt(a,t),Ft(t),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,gi(t,l)));break;case 30:break;case 21:break;default:Jt(a,t),Ft(t)}}function Ft(t){var a=t.flags;if(a&2){try{for(var e,l=t.return;l!==null;){if(Jo(l)){e=l;break}l=l.return}if(e==null)throw Error(p(160));switch(e.tag){case 27:var n=e.stateNode,i=bc(t);pi(t,i,n);break;case 5:var u=e.stateNode;e.flags&32&&(Fe(u,""),e.flags&=-33);var c=bc(t);pi(t,c,u);break;case 3:case 4:var f=e.stateNode.containerInfo,h=bc(t);Sc(t,h,f);break;default:throw Error(p(161))}}catch(y){it(t,t.return,y)}t.flags&=-3}a&4096&&(t.flags&=-4097)}function ls(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var a=t;ls(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),t=t.sibling}}function Va(t,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)$o(t,a.alternate,a),a=a.sibling}function qe(t){for(t=t.child;t!==null;){var a=t;switch(a.tag){case 0:case 11:case 14:case 15:fe(4,a,a.return),qe(a);break;case 1:Ma(a,a.return);var e=a.stateNode;typeof e.componentWillUnmount=="function"&&Ko(a,a.return,e),qe(a);break;case 27:gn(a.stateNode);case 26:case 5:Ma(a,a.return),qe(a);break;case 22:a.memoizedState===null&&qe(a);break;case 30:qe(a);break;default:qe(a)}t=t.sibling}}function Ka(t,a,e){for(e=e&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var l=a.alternate,n=t,i=a,u=i.flags;switch(i.tag){case 0:case 11:case 15:Ka(n,i,e),ln(4,i);break;case 1:if(Ka(n,i,e),l=i,n=l.stateNode,typeof n.componentDidMount=="function")try{n.componentDidMount()}catch(h){it(l,l.return,h)}if(l=i,n=l.updateQueue,n!==null){var c=l.stateNode;try{var f=n.shared.hiddenCallbacks;if(f!==null)for(n.shared.hiddenCallbacks=null,n=0;n<f.length;n++)Cf(f[n],c)}catch(h){it(l,l.return,h)}}e&&u&64&&Vo(i),nn(i,i.return);break;case 27:Fo(i);case 26:case 5:Ka(n,i,e),e&&l===null&&u&4&&ko(i),nn(i,i.return);break;case 12:Ka(n,i,e);break;case 31:Ka(n,i,e),e&&u&4&&ts(n,i);break;case 13:Ka(n,i,e),e&&u&4&&as(n,i);break;case 22:i.memoizedState===null&&Ka(n,i,e),nn(i,i.return);break;case 30:break;default:Ka(n,i,e)}a=a.sibling}}function Ec(t,a){var e=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),t=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(t=a.memoizedState.cachePool.pool),t!==e&&(t!=null&&t.refCount++,e!=null&&Zl(e))}function Tc(t,a){t=null,a.alternate!==null&&(t=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==t&&(a.refCount++,t!=null&&Zl(t))}function Ea(t,a,e,l){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)ns(t,a,e,l),a=a.sibling}function ns(t,a,e,l){var n=a.flags;switch(a.tag){case 0:case 11:case 15:Ea(t,a,e,l),n&2048&&ln(9,a);break;case 1:Ea(t,a,e,l);break;case 3:Ea(t,a,e,l),n&2048&&(t=null,a.alternate!==null&&(t=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==t&&(a.refCount++,t!=null&&Zl(t)));break;case 12:if(n&2048){Ea(t,a,e,l),t=a.stateNode;try{var i=a.memoizedProps,u=i.id,c=i.onPostCommit;typeof c=="function"&&c(u,a.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(f){it(a,a.return,f)}}else Ea(t,a,e,l);break;case 31:Ea(t,a,e,l);break;case 13:Ea(t,a,e,l);break;case 23:break;case 22:i=a.stateNode,u=a.alternate,a.memoizedState!==null?i._visibility&2?Ea(t,a,e,l):un(t,a):i._visibility&2?Ea(t,a,e,l):(i._visibility|=2,hl(t,a,e,l,(a.subtreeFlags&10256)!==0||!1)),n&2048&&Ec(u,a);break;case 24:Ea(t,a,e,l),n&2048&&Tc(a.alternate,a);break;default:Ea(t,a,e,l)}}function hl(t,a,e,l,n){for(n=n&&((a.subtreeFlags&10256)!==0||!1),a=a.child;a!==null;){var i=t,u=a,c=e,f=l,h=u.flags;switch(u.tag){case 0:case 11:case 15:hl(i,u,c,f,n),ln(8,u);break;case 23:break;case 22:var y=u.stateNode;u.memoizedState!==null?y._visibility&2?hl(i,u,c,f,n):un(i,u):(y._visibility|=2,hl(i,u,c,f,n)),n&&h&2048&&Ec(u.alternate,u);break;case 24:hl(i,u,c,f,n),n&&h&2048&&Tc(u.alternate,u);break;default:hl(i,u,c,f,n)}a=a.sibling}}function un(t,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var e=t,l=a,n=l.flags;switch(l.tag){case 22:un(e,l),n&2048&&Ec(l.alternate,l);break;case 24:un(e,l),n&2048&&Tc(l.alternate,l);break;default:un(e,l)}a=a.sibling}}var cn=8192;function ml(t,a,e){if(t.subtreeFlags&cn)for(t=t.child;t!==null;)is(t,a,e),t=t.sibling}function is(t,a,e){switch(t.tag){case 26:ml(t,a,e),t.flags&cn&&t.memoizedState!==null&&kg(e,za,t.memoizedState,t.memoizedProps);break;case 5:ml(t,a,e);break;case 3:case 4:var l=za;za=Oi(t.stateNode.containerInfo),ml(t,a,e),za=l;break;case 22:t.memoizedState===null&&(l=t.alternate,l!==null&&l.memoizedState!==null?(l=cn,cn=16777216,ml(t,a,e),cn=l):ml(t,a,e));break;default:ml(t,a,e)}}function us(t){var a=t.alternate;if(a!==null&&(t=a.child,t!==null)){a.child=null;do a=t.sibling,t.sibling=null,t=a;while(t!==null)}}function rn(t){var a=t.deletions;if((t.flags&16)!==0){if(a!==null)for(var e=0;e<a.length;e++){var l=a[e];Mt=l,rs(l,t)}us(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)cs(t),t=t.sibling}function cs(t){switch(t.tag){case 0:case 11:case 15:rn(t),t.flags&2048&&fe(9,t,t.return);break;case 3:rn(t);break;case 12:rn(t);break;case 22:var a=t.stateNode;t.memoizedState!==null&&a._visibility&2&&(t.return===null||t.return.tag!==13)?(a._visibility&=-3,hi(t)):rn(t);break;default:rn(t)}}function hi(t){var a=t.deletions;if((t.flags&16)!==0){if(a!==null)for(var e=0;e<a.length;e++){var l=a[e];Mt=l,rs(l,t)}us(t)}for(t=t.child;t!==null;){switch(a=t,a.tag){case 0:case 11:case 15:fe(8,a,a.return),hi(a);break;case 22:e=a.stateNode,e._visibility&2&&(e._visibility&=-3,hi(a));break;default:hi(a)}t=t.sibling}}function rs(t,a){for(;Mt!==null;){var e=Mt;switch(e.tag){case 0:case 11:case 15:fe(8,e,a);break;case 23:case 22:if(e.memoizedState!==null&&e.memoizedState.cachePool!==null){var l=e.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Zl(e.memoizedState.cache)}if(l=e.child,l!==null)l.return=e,Mt=l;else t:for(e=t;Mt!==null;){l=Mt;var n=l.sibling,i=l.return;if(Io(l),l===e){Mt=null;break t}if(n!==null){n.return=i,Mt=n;break t}Mt=i}}}var rg={getCacheForType:function(t){var a=Ct(Et),e=a.data.get(t);return e===void 0&&(e=t(),a.data.set(t,e)),e},cacheSignal:function(){return Ct(Et).controller.signal}},fg=typeof WeakMap=="function"?WeakMap:Map,at=0,st=null,V=null,F=0,nt=0,ia=null,oe=!1,xl=!1,Ac=!1,ka=0,yt=0,se=0,Ge=0,Nc=0,ua=0,vl=0,fn=null,Wt=null,jc=!1,mi=0,fs=0,xi=1/0,vi=null,de=null,jt=0,pe=null,yl=null,Ja=0,Oc=0,Mc=null,os=null,on=0,wc=null;function ca(){return(at&2)!==0&&F!==0?F&-F:b.T!==null?Bc():Tr()}function ss(){if(ua===0)if((F&536870912)===0||I){var t=Nn;Nn<<=1,(Nn&3932160)===0&&(Nn=262144),ua=t}else ua=536870912;return t=la.current,t!==null&&(t.flags|=32),ua}function $t(t,a,e){(t===st&&(nt===2||nt===9)||t.cancelPendingCommit!==null)&&(bl(t,0),ge(t,F,ua,!1)),wl(t,e),((at&2)===0||t!==st)&&(t===st&&((at&2)===0&&(Ge|=e),yt===4&&ge(t,F,ua,!1)),wa(t))}function ds(t,a,e){if((at&6)!==0)throw Error(p(327));var l=!e&&(a&127)===0&&(a&t.expiredLanes)===0||Ml(t,a),n=l?dg(t,a):Dc(t,a,!0),i=l;do{if(n===0){xl&&!l&&ge(t,a,0,!1);break}else{if(e=t.current.alternate,i&&!og(e)){n=Dc(t,a,!1),i=!1;continue}if(n===2){if(i=a,t.errorRecoveryDisabledLanes&i)var u=0;else u=t.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){a=u;t:{var c=t;n=fn;var f=c.current.memoizedState.isDehydrated;if(f&&(bl(c,u).flags|=256),u=Dc(c,u,!1),u!==2){if(Ac&&!f){c.errorRecoveryDisabledLanes|=i,Ge|=i,n=4;break t}i=Wt,Wt=n,i!==null&&(Wt===null?Wt=i:Wt.push.apply(Wt,i))}n=u}if(i=!1,n!==2)continue}}if(n===1){bl(t,0),ge(t,a,0,!0);break}t:{switch(l=t,i=n,i){case 0:case 1:throw Error(p(345));case 4:if((a&4194048)!==a)break;case 6:ge(l,a,ua,!oe);break t;case 2:Wt=null;break;case 3:case 5:break;default:throw Error(p(329))}if((a&62914560)===a&&(n=mi+300-It(),10<n)){if(ge(l,a,ua,!oe),On(l,0,!0)!==0)break t;Ja=a,l.timeoutHandle=Qs(ps.bind(null,l,e,Wt,vi,jc,a,ua,Ge,vl,oe,i,"Throttled",-0,0),n);break t}ps(l,e,Wt,vi,jc,a,ua,Ge,vl,oe,i,null,-0,0)}}break}while(!0);wa(t)}function ps(t,a,e,l,n,i,u,c,f,h,y,E,m,v){if(t.timeoutHandle=-1,E=a.subtreeFlags,E&8192||(E&16785408)===16785408){E={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ca},is(a,i,E);var M=(i&62914560)===i?mi-It():(i&4194048)===i?fs-It():0;if(M=Jg(E,M),M!==null){Ja=i,t.cancelPendingCommit=M(Ss.bind(null,t,a,i,e,l,n,u,c,f,y,E,null,m,v)),ge(t,i,u,!h);return}}Ss(t,a,i,e,l,n,u,c,f)}function og(t){for(var a=t;;){var e=a.tag;if((e===0||e===11||e===15)&&a.flags&16384&&(e=a.updateQueue,e!==null&&(e=e.stores,e!==null)))for(var l=0;l<e.length;l++){var n=e[l],i=n.getSnapshot;n=n.value;try{if(!aa(i(),n))return!1}catch{return!1}}if(e=a.child,a.subtreeFlags&16384&&e!==null)e.return=a,a=e;else{if(a===t)break;for(;a.sibling===null;){if(a.return===null||a.return===t)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function ge(t,a,e,l){a&=~Nc,a&=~Ge,t.suspendedLanes|=a,t.pingedLanes&=~a,l&&(t.warmLanes|=a),l=t.expirationTimes;for(var n=a;0<n;){var i=31-ta(n),u=1<<i;l[i]=-1,n&=~u}e!==0&&Sr(t,e,a)}function yi(){return(at&6)===0?(sn(0),!1):!0}function _c(){if(V!==null){if(nt===0)var t=V.return;else t=V,Ha=De=null,ku(t),ol=null,Kl=0,t=V;for(;t!==null;)Zo(t.alternate,t),t=t.return;V=null}}function bl(t,a){var e=t.timeoutHandle;e!==-1&&(t.timeoutHandle=-1,wg(e)),e=t.cancelPendingCommit,e!==null&&(t.cancelPendingCommit=null,e()),Ja=0,_c(),st=t,V=e=Ua(t.current,null),F=a,nt=0,ia=null,oe=!1,xl=Ml(t,a),Ac=!1,vl=ua=Nc=Ge=se=yt=0,Wt=fn=null,jc=!1,(a&8)!==0&&(a|=a&32);var l=t.entangledLanes;if(l!==0)for(t=t.entanglements,l&=a;0<l;){var n=31-ta(l),i=1<<n;a|=t[n],l&=~i}return ka=a,qn(),e}function gs(t,a){G=null,b.H=tn,a===fl||a===Jn?(a=Mf(),nt=3):a===Uu?(a=Mf(),nt=4):nt=a===fc?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,ia=a,V===null&&(yt=1,ri(t,pa(a,t.current)))}function hs(){var t=la.current;return t===null?!0:(F&4194048)===F?xa===null:(F&62914560)===F||(F&536870912)!==0?t===xa:!1}function ms(){var t=b.H;return b.H=tn,t===null?tn:t}function xs(){var t=b.A;return b.A=rg,t}function bi(){yt=4,oe||(F&4194048)!==F&&la.current!==null||(xl=!0),(se&134217727)===0&&(Ge&134217727)===0||st===null||ge(st,F,ua,!1)}function Dc(t,a,e){var l=at;at|=2;var n=ms(),i=xs();(st!==t||F!==a)&&(vi=null,bl(t,a)),a=!1;var u=yt;t:do try{if(nt!==0&&V!==null){var c=V,f=ia;switch(nt){case 8:_c(),u=6;break t;case 3:case 2:case 9:case 6:la.current===null&&(a=!0);var h=nt;if(nt=0,ia=null,Sl(t,c,f,h),e&&xl){u=0;break t}break;default:h=nt,nt=0,ia=null,Sl(t,c,f,h)}}sg(),u=yt;break}catch(y){gs(t,y)}while(!0);return a&&t.shellSuspendCounter++,Ha=De=null,at=l,b.H=n,b.A=i,V===null&&(st=null,F=0,qn()),u}function sg(){for(;V!==null;)vs(V)}function dg(t,a){var e=at;at|=2;var l=ms(),n=xs();st!==t||F!==a?(vi=null,xi=It()+500,bl(t,a)):xl=Ml(t,a);t:do try{if(nt!==0&&V!==null){a=V;var i=ia;a:switch(nt){case 1:nt=0,ia=null,Sl(t,a,i,1);break;case 2:case 9:if(jf(i)){nt=0,ia=null,ys(a);break}a=function(){nt!==2&&nt!==9||st!==t||(nt=7),wa(t)},i.then(a,a);break t;case 3:nt=7;break t;case 4:nt=5;break t;case 7:jf(i)?(nt=0,ia=null,ys(a)):(nt=0,ia=null,Sl(t,a,i,7));break;case 5:var u=null;switch(V.tag){case 26:u=V.memoizedState;case 5:case 27:var c=V;if(u?nd(u):c.stateNode.complete){nt=0,ia=null;var f=c.sibling;if(f!==null)V=f;else{var h=c.return;h!==null?(V=h,Si(h)):V=null}break a}}nt=0,ia=null,Sl(t,a,i,5);break;case 6:nt=0,ia=null,Sl(t,a,i,6);break;case 8:_c(),yt=6;break t;default:throw Error(p(462))}}pg();break}catch(y){gs(t,y)}while(!0);return Ha=De=null,b.H=l,b.A=n,at=e,V!==null?0:(st=null,F=0,qn(),yt)}function pg(){for(;V!==null&&!Bd();)vs(V)}function vs(t){var a=Xo(t.alternate,t,ka);t.memoizedProps=t.pendingProps,a===null?Si(t):V=a}function ys(t){var a=t,e=a.alternate;switch(a.tag){case 15:case 0:a=Bo(e,a,a.pendingProps,a.type,void 0,F);break;case 11:a=Bo(e,a,a.pendingProps,a.type.render,a.ref,F);break;case 5:ku(a);default:Zo(e,a),a=V=mf(a,ka),a=Xo(e,a,ka)}t.memoizedProps=t.pendingProps,a===null?Si(t):V=a}function Sl(t,a,e,l){Ha=De=null,ku(a),ol=null,Kl=0;var n=a.return;try{if(ag(t,n,a,e,F)){yt=1,ri(t,pa(e,t.current)),V=null;return}}catch(i){if(n!==null)throw V=n,i;yt=1,ri(t,pa(e,t.current)),V=null;return}a.flags&32768?(I||l===1?t=!0:xl||(F&536870912)!==0?t=!1:(oe=t=!0,(l===2||l===9||l===3||l===6)&&(l=la.current,l!==null&&l.tag===13&&(l.flags|=16384))),bs(a,t)):Si(a)}function Si(t){var a=t;do{if((a.flags&32768)!==0){bs(a,oe);return}t=a.return;var e=ng(a.alternate,a,ka);if(e!==null){V=e;return}if(a=a.sibling,a!==null){V=a;return}V=a=t}while(a!==null);yt===0&&(yt=5)}function bs(t,a){do{var e=ig(t.alternate,t);if(e!==null){e.flags&=32767,V=e;return}if(e=t.return,e!==null&&(e.flags|=32768,e.subtreeFlags=0,e.deletions=null),!a&&(t=t.sibling,t!==null)){V=t;return}V=t=e}while(t!==null);yt=6,V=null}function Ss(t,a,e,l,n,i,u,c,f){t.cancelPendingCommit=null;do zi();while(jt!==0);if((at&6)!==0)throw Error(p(327));if(a!==null){if(a===t.current)throw Error(p(177));if(i=a.lanes|a.childLanes,i|=bu,Kd(t,e,i,u,c,f),t===st&&(V=st=null,F=0),yl=a,pe=t,Ja=e,Oc=i,Mc=n,os=l,(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,xg(Tn,function(){return Ns(),null})):(t.callbackNode=null,t.callbackPriority=0),l=(a.flags&13878)!==0,(a.subtreeFlags&13878)!==0||l){l=b.T,b.T=null,n=N.p,N.p=2,u=at,at|=4;try{ug(t,a,e)}finally{at=u,N.p=n,b.T=l}}jt=1,zs(),Es(),Ts()}}function zs(){if(jt===1){jt=0;var t=pe,a=yl,e=(a.flags&13878)!==0;if((a.subtreeFlags&13878)!==0||e){e=b.T,b.T=null;var l=N.p;N.p=2;var n=at;at|=4;try{es(a,t);var i=Zc,u=cf(t.containerInfo),c=i.focusedElem,f=i.selectionRange;if(u!==c&&c&&c.ownerDocument&&uf(c.ownerDocument.documentElement,c)){if(f!==null&&hu(c)){var h=f.start,y=f.end;if(y===void 0&&(y=h),"selectionStart"in c)c.selectionStart=h,c.selectionEnd=Math.min(y,c.value.length);else{var E=c.ownerDocument||document,m=E&&E.defaultView||window;if(m.getSelection){var v=m.getSelection(),M=c.textContent.length,B=Math.min(f.start,M),ft=f.end===void 0?B:Math.min(f.end,M);!v.extend&&B>ft&&(u=ft,ft=B,B=u);var d=nf(c,B),o=nf(c,ft);if(d&&o&&(v.rangeCount!==1||v.anchorNode!==d.node||v.anchorOffset!==d.offset||v.focusNode!==o.node||v.focusOffset!==o.offset)){var g=E.createRange();g.setStart(d.node,d.offset),v.removeAllRanges(),B>ft?(v.addRange(g),v.extend(o.node,o.offset)):(g.setEnd(o.node,o.offset),v.addRange(g))}}}}for(E=[],v=c;v=v.parentNode;)v.nodeType===1&&E.push({element:v,left:v.scrollLeft,top:v.scrollTop});for(typeof c.focus=="function"&&c.focus(),c=0;c<E.length;c++){var z=E[c];z.element.scrollLeft=z.left,z.element.scrollTop=z.top}}Ri=!!Qc,Zc=Qc=null}finally{at=n,N.p=l,b.T=e}}t.current=a,jt=2}}function Es(){if(jt===2){jt=0;var t=pe,a=yl,e=(a.flags&8772)!==0;if((a.subtreeFlags&8772)!==0||e){e=b.T,b.T=null;var l=N.p;N.p=2;var n=at;at|=4;try{$o(t,a.alternate,a)}finally{at=n,N.p=l,b.T=e}}jt=3}}function Ts(){if(jt===4||jt===3){jt=0,Hd();var t=pe,a=yl,e=Ja,l=os;(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?jt=5:(jt=0,yl=pe=null,As(t,t.pendingLanes));var n=t.pendingLanes;if(n===0&&(de=null),Wi(e),a=a.stateNode,Pt&&typeof Pt.onCommitFiberRoot=="function")try{Pt.onCommitFiberRoot(Ol,a,void 0,(a.current.flags&128)===128)}catch{}if(l!==null){a=b.T,n=N.p,N.p=2,b.T=null;try{for(var i=t.onRecoverableError,u=0;u<l.length;u++){var c=l[u];i(c.value,{componentStack:c.stack})}}finally{b.T=a,N.p=n}}(Ja&3)!==0&&zi(),wa(t),n=t.pendingLanes,(e&261930)!==0&&(n&42)!==0?t===wc?on++:(on=0,wc=t):on=0,sn(0)}}function As(t,a){(t.pooledCacheLanes&=a)===0&&(a=t.pooledCache,a!=null&&(t.pooledCache=null,Zl(a)))}function zi(){return zs(),Es(),Ts(),Ns()}function Ns(){if(jt!==5)return!1;var t=pe,a=Oc;Oc=0;var e=Wi(Ja),l=b.T,n=N.p;try{N.p=32>e?32:e,b.T=null,e=Mc,Mc=null;var i=pe,u=Ja;if(jt=0,yl=pe=null,Ja=0,(at&6)!==0)throw Error(p(331));var c=at;if(at|=4,cs(i.current),ns(i,i.current,u,e),at=c,sn(0,!1),Pt&&typeof Pt.onPostCommitFiberRoot=="function")try{Pt.onPostCommitFiberRoot(Ol,i)}catch{}return!0}finally{N.p=n,b.T=l,As(t,a)}}function js(t,a,e){a=pa(e,a),a=rc(t.stateNode,a,2),t=ue(t,a,2),t!==null&&(wl(t,2),wa(t))}function it(t,a,e){if(t.tag===3)js(t,t,e);else for(;a!==null;){if(a.tag===3){js(a,t,e);break}else if(a.tag===1){var l=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(de===null||!de.has(l))){t=pa(e,t),e=Oo(2),l=ue(a,e,2),l!==null&&(Mo(e,l,a,t),wl(l,2),wa(l));break}}a=a.return}}function Cc(t,a,e){var l=t.pingCache;if(l===null){l=t.pingCache=new fg;var n=new Set;l.set(a,n)}else n=l.get(a),n===void 0&&(n=new Set,l.set(a,n));n.has(e)||(Ac=!0,n.add(e),t=gg.bind(null,t,a,e),a.then(t,t))}function gg(t,a,e){var l=t.pingCache;l!==null&&l.delete(a),t.pingedLanes|=t.suspendedLanes&e,t.warmLanes&=~e,st===t&&(F&e)===e&&(yt===4||yt===3&&(F&62914560)===F&&300>It()-mi?(at&2)===0&&bl(t,0):Nc|=e,vl===F&&(vl=0)),wa(t)}function Os(t,a){a===0&&(a=br()),t=Me(t,a),t!==null&&(wl(t,a),wa(t))}function hg(t){var a=t.memoizedState,e=0;a!==null&&(e=a.retryLane),Os(t,e)}function mg(t,a){var e=0;switch(t.tag){case 31:case 13:var l=t.stateNode,n=t.memoizedState;n!==null&&(e=n.retryLane);break;case 19:l=t.stateNode;break;case 22:l=t.stateNode._retryCache;break;default:throw Error(p(314))}l!==null&&l.delete(a),Os(t,e)}function xg(t,a){return Ki(t,a)}var Ei=null,zl=null,Rc=!1,Ti=!1,Uc=!1,he=0;function wa(t){t!==zl&&t.next===null&&(zl===null?Ei=zl=t:zl=zl.next=t),Ti=!0,Rc||(Rc=!0,yg())}function sn(t,a){if(!Uc&&Ti){Uc=!0;do for(var e=!1,l=Ei;l!==null;){if(t!==0){var n=l.pendingLanes;if(n===0)var i=0;else{var u=l.suspendedLanes,c=l.pingedLanes;i=(1<<31-ta(42|t)+1)-1,i&=n&~(u&~c),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(e=!0,Ds(l,i))}else i=F,i=On(l,l===st?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||Ml(l,i)||(e=!0,Ds(l,i));l=l.next}while(e);Uc=!1}}function vg(){Ms()}function Ms(){Ti=Rc=!1;var t=0;he!==0&&Mg()&&(t=he);for(var a=It(),e=null,l=Ei;l!==null;){var n=l.next,i=ws(l,a);i===0?(l.next=null,e===null?Ei=n:e.next=n,n===null&&(zl=e)):(e=l,(t!==0||(i&3)!==0)&&(Ti=!0)),l=n}jt!==0&&jt!==5||sn(t),he!==0&&(he=0)}function ws(t,a){for(var e=t.suspendedLanes,l=t.pingedLanes,n=t.expirationTimes,i=t.pendingLanes&-62914561;0<i;){var u=31-ta(i),c=1<<u,f=n[u];f===-1?((c&e)===0||(c&l)!==0)&&(n[u]=Vd(c,a)):f<=a&&(t.expiredLanes|=c),i&=~c}if(a=st,e=F,e=On(t,t===a?e:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l=t.callbackNode,e===0||t===a&&(nt===2||nt===9)||t.cancelPendingCommit!==null)return l!==null&&l!==null&&ki(l),t.callbackNode=null,t.callbackPriority=0;if((e&3)===0||Ml(t,e)){if(a=e&-e,a===t.callbackPriority)return a;switch(l!==null&&ki(l),Wi(e)){case 2:case 8:e=vr;break;case 32:e=Tn;break;case 268435456:e=yr;break;default:e=Tn}return l=_s.bind(null,t),e=Ki(e,l),t.callbackPriority=a,t.callbackNode=e,a}return l!==null&&l!==null&&ki(l),t.callbackPriority=2,t.callbackNode=null,2}function _s(t,a){if(jt!==0&&jt!==5)return t.callbackNode=null,t.callbackPriority=0,null;var e=t.callbackNode;if(zi()&&t.callbackNode!==e)return null;var l=F;return l=On(t,t===st?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l===0?null:(ds(t,l,a),ws(t,It()),t.callbackNode!=null&&t.callbackNode===e?_s.bind(null,t):null)}function Ds(t,a){if(zi())return null;ds(t,a,!0)}function yg(){_g(function(){(at&6)!==0?Ki(xr,vg):Ms()})}function Bc(){if(he===0){var t=cl;t===0&&(t=An,An<<=1,(An&261888)===0&&(An=256)),he=t}return he}function Cs(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Dn(""+t)}function Rs(t,a){var e=a.ownerDocument.createElement("input");return e.name=a.name,e.value=a.value,t.id&&e.setAttribute("form",t.id),a.parentNode.insertBefore(e,a),t=new FormData(t),e.parentNode.removeChild(e),t}function bg(t,a,e,l,n){if(a==="submit"&&e&&e.stateNode===n){var i=Cs((n[Vt]||null).action),u=l.submitter;u&&(a=(a=u[Vt]||null)?Cs(a.formAction):u.getAttribute("formAction"),a!==null&&(i=a,u=null));var c=new Bn("action","action",null,l,n);t.push({event:c,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(he!==0){var f=u?Rs(n,u):new FormData(n);ec(e,{pending:!0,data:f,method:n.method,action:i},null,f)}}else typeof i=="function"&&(c.preventDefault(),f=u?Rs(n,u):new FormData(n),ec(e,{pending:!0,data:f,method:n.method,action:i},i,f))},currentTarget:n}]})}}for(var Hc=0;Hc<yu.length;Hc++){var Yc=yu[Hc],Sg=Yc.toLowerCase(),zg=Yc[0].toUpperCase()+Yc.slice(1);Sa(Sg,"on"+zg)}Sa(of,"onAnimationEnd"),Sa(sf,"onAnimationIteration"),Sa(df,"onAnimationStart"),Sa("dblclick","onDoubleClick"),Sa("focusin","onFocus"),Sa("focusout","onBlur"),Sa(Yp,"onTransitionRun"),Sa(Lp,"onTransitionStart"),Sa(qp,"onTransitionCancel"),Sa(pf,"onTransitionEnd"),ke("onMouseEnter",["mouseout","mouseover"]),ke("onMouseLeave",["mouseout","mouseover"]),ke("onPointerEnter",["pointerout","pointerover"]),ke("onPointerLeave",["pointerout","pointerover"]),Ae("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ae("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ae("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ae("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ae("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ae("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var dn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Eg=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(dn));function Us(t,a){a=(a&4)!==0;for(var e=0;e<t.length;e++){var l=t[e],n=l.event;l=l.listeners;t:{var i=void 0;if(a)for(var u=l.length-1;0<=u;u--){var c=l[u],f=c.instance,h=c.currentTarget;if(c=c.listener,f!==i&&n.isPropagationStopped())break t;i=c,n.currentTarget=h;try{i(n)}catch(y){Ln(y)}n.currentTarget=null,i=f}else for(u=0;u<l.length;u++){if(c=l[u],f=c.instance,h=c.currentTarget,c=c.listener,f!==i&&n.isPropagationStopped())break t;i=c,n.currentTarget=h;try{i(n)}catch(y){Ln(y)}n.currentTarget=null,i=f}}}}function K(t,a){var e=a[$i];e===void 0&&(e=a[$i]=new Set);var l=t+"__bubble";e.has(l)||(Bs(a,t,2,!1),e.add(l))}function Lc(t,a,e){var l=0;a&&(l|=4),Bs(e,t,l,a)}var Ai="_reactListening"+Math.random().toString(36).slice(2);function qc(t){if(!t[Ai]){t[Ai]=!0,jr.forEach(function(e){e!=="selectionchange"&&(Eg.has(e)||Lc(e,!1,t),Lc(e,!0,t))});var a=t.nodeType===9?t:t.ownerDocument;a===null||a[Ai]||(a[Ai]=!0,Lc("selectionchange",!1,a))}}function Bs(t,a,e,l){switch(sd(a)){case 2:var n=$g;break;case 8:n=Ig;break;default:n=ar}e=n.bind(null,a,e,t),n=void 0,!uu||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(n=!0),l?n!==void 0?t.addEventListener(a,e,{capture:!0,passive:n}):t.addEventListener(a,e,!0):n!==void 0?t.addEventListener(a,e,{passive:n}):t.addEventListener(a,e,!1)}function Gc(t,a,e,l,n){var i=l;if((a&1)===0&&(a&2)===0&&l!==null)t:for(;;){if(l===null)return;var u=l.tag;if(u===3||u===4){var c=l.stateNode.containerInfo;if(c===n)break;if(u===4)for(u=l.return;u!==null;){var f=u.tag;if((f===3||f===4)&&u.stateNode.containerInfo===n)return;u=u.return}for(;c!==null;){if(u=Ze(c),u===null)return;if(f=u.tag,f===5||f===6||f===26||f===27){l=i=u;continue t}c=c.parentNode}}l=l.return}Lr(function(){var h=i,y=nu(e),E=[];t:{var m=gf.get(t);if(m!==void 0){var v=Bn,M=t;switch(t){case"keypress":if(Rn(e)===0)break t;case"keydown":case"keyup":v=mp;break;case"focusin":M="focus",v=ou;break;case"focusout":M="blur",v=ou;break;case"beforeblur":case"afterblur":v=ou;break;case"click":if(e.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=Xr;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=np;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=yp;break;case of:case sf:case df:v=cp;break;case pf:v=Sp;break;case"scroll":case"scrollend":v=ep;break;case"wheel":v=Ep;break;case"copy":case"cut":case"paste":v=fp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=Zr;break;case"toggle":case"beforetoggle":v=Ap}var B=(a&4)!==0,ft=!B&&(t==="scroll"||t==="scrollend"),d=B?m!==null?m+"Capture":null:m;B=[];for(var o=h,g;o!==null;){var z=o;if(g=z.stateNode,z=z.tag,z!==5&&z!==26&&z!==27||g===null||d===null||(z=Cl(o,d),z!=null&&B.push(pn(o,z,g))),ft)break;o=o.return}0<B.length&&(m=new v(m,M,null,e,y),E.push({event:m,listeners:B}))}}if((a&7)===0){t:{if(m=t==="mouseover"||t==="pointerover",v=t==="mouseout"||t==="pointerout",m&&e!==lu&&(M=e.relatedTarget||e.fromElement)&&(Ze(M)||M[Qe]))break t;if((v||m)&&(m=y.window===y?y:(m=y.ownerDocument)?m.defaultView||m.parentWindow:window,v?(M=e.relatedTarget||e.toElement,v=h,M=M?Ze(M):null,M!==null&&(ft=H(M),B=M.tag,M!==ft||B!==5&&B!==27&&B!==6)&&(M=null)):(v=null,M=h),v!==M)){if(B=Xr,z="onMouseLeave",d="onMouseEnter",o="mouse",(t==="pointerout"||t==="pointerover")&&(B=Zr,z="onPointerLeave",d="onPointerEnter",o="pointer"),ft=v==null?m:Dl(v),g=M==null?m:Dl(M),m=new B(z,o+"leave",v,e,y),m.target=ft,m.relatedTarget=g,z=null,Ze(y)===h&&(B=new B(d,o+"enter",M,e,y),B.target=g,B.relatedTarget=ft,z=B),ft=z,v&&M)a:{for(B=Tg,d=v,o=M,g=0,z=d;z;z=B(z))g++;z=0;for(var D=o;D;D=B(D))z++;for(;0<g-z;)d=B(d),g--;for(;0<z-g;)o=B(o),z--;for(;g--;){if(d===o||o!==null&&d===o.alternate){B=d;break a}d=B(d),o=B(o)}B=null}else B=null;v!==null&&Hs(E,m,v,B,!1),M!==null&&ft!==null&&Hs(E,ft,M,B,!0)}}t:{if(m=h?Dl(h):window,v=m.nodeName&&m.nodeName.toLowerCase(),v==="select"||v==="input"&&m.type==="file")var P=Ir;else if(Wr(m))if(Pr)P=Up;else{P=Cp;var _=Dp}else v=m.nodeName,!v||v.toLowerCase()!=="input"||m.type!=="checkbox"&&m.type!=="radio"?h&&eu(h.elementType)&&(P=Ir):P=Rp;if(P&&(P=P(t,h))){$r(E,P,e,y);break t}_&&_(t,m,h),t==="focusout"&&h&&m.type==="number"&&h.memoizedProps.value!=null&&au(m,"number",m.value)}switch(_=h?Dl(h):window,t){case"focusin":(Wr(_)||_.contentEditable==="true")&&(Pe=_,mu=h,Gl=null);break;case"focusout":Gl=mu=Pe=null;break;case"mousedown":xu=!0;break;case"contextmenu":case"mouseup":case"dragend":xu=!1,rf(E,e,y);break;case"selectionchange":if(Hp)break;case"keydown":case"keyup":rf(E,e,y)}var X;if(du)t:{switch(t){case"compositionstart":var W="onCompositionStart";break t;case"compositionend":W="onCompositionEnd";break t;case"compositionupdate":W="onCompositionUpdate";break t}W=void 0}else Ie?Jr(t,e)&&(W="onCompositionEnd"):t==="keydown"&&e.keyCode===229&&(W="onCompositionStart");W&&(Vr&&e.locale!=="ko"&&(Ie||W!=="onCompositionStart"?W==="onCompositionEnd"&&Ie&&(X=qr()):(Pa=y,cu="value"in Pa?Pa.value:Pa.textContent,Ie=!0)),_=Ni(h,W),0<_.length&&(W=new Qr(W,t,null,e,y),E.push({event:W,listeners:_}),X?W.data=X:(X=Fr(e),X!==null&&(W.data=X)))),(X=jp?Op(t,e):Mp(t,e))&&(W=Ni(h,"onBeforeInput"),0<W.length&&(_=new Qr("onBeforeInput","beforeinput",null,e,y),E.push({event:_,listeners:W}),_.data=X)),bg(E,t,h,e,y)}Us(E,a)})}function pn(t,a,e){return{instance:t,listener:a,currentTarget:e}}function Ni(t,a){for(var e=a+"Capture",l=[];t!==null;){var n=t,i=n.stateNode;if(n=n.tag,n!==5&&n!==26&&n!==27||i===null||(n=Cl(t,e),n!=null&&l.unshift(pn(t,n,i)),n=Cl(t,a),n!=null&&l.push(pn(t,n,i))),t.tag===3)return l;t=t.return}return[]}function Tg(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Hs(t,a,e,l,n){for(var i=a._reactName,u=[];e!==null&&e!==l;){var c=e,f=c.alternate,h=c.stateNode;if(c=c.tag,f!==null&&f===l)break;c!==5&&c!==26&&c!==27||h===null||(f=h,n?(h=Cl(e,i),h!=null&&u.unshift(pn(e,h,f))):n||(h=Cl(e,i),h!=null&&u.push(pn(e,h,f)))),e=e.return}u.length!==0&&t.push({event:a,listeners:u})}var Ag=/\r\n?/g,Ng=/\u0000|\uFFFD/g;function Ys(t){return(typeof t=="string"?t:""+t).replace(Ag,`
`).replace(Ng,"")}function Ls(t,a){return a=Ys(a),Ys(t)===a}function rt(t,a,e,l,n,i){switch(e){case"children":typeof l=="string"?a==="body"||a==="textarea"&&l===""||Fe(t,l):(typeof l=="number"||typeof l=="bigint")&&a!=="body"&&Fe(t,""+l);break;case"className":wn(t,"class",l);break;case"tabIndex":wn(t,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":wn(t,e,l);break;case"style":Hr(t,l,i);break;case"data":if(a!=="object"){wn(t,"data",l);break}case"src":case"href":if(l===""&&(a!=="a"||e!=="href")){t.removeAttribute(e);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(e);break}l=Dn(""+l),t.setAttribute(e,l);break;case"action":case"formAction":if(typeof l=="function"){t.setAttribute(e,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(e==="formAction"?(a!=="input"&&rt(t,a,"name",n.name,n,null),rt(t,a,"formEncType",n.formEncType,n,null),rt(t,a,"formMethod",n.formMethod,n,null),rt(t,a,"formTarget",n.formTarget,n,null)):(rt(t,a,"encType",n.encType,n,null),rt(t,a,"method",n.method,n,null),rt(t,a,"target",n.target,n,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(e);break}l=Dn(""+l),t.setAttribute(e,l);break;case"onClick":l!=null&&(t.onclick=Ca);break;case"onScroll":l!=null&&K("scroll",t);break;case"onScrollEnd":l!=null&&K("scrollend",t);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(p(61));if(e=l.__html,e!=null){if(n.children!=null)throw Error(p(60));t.innerHTML=e}}break;case"multiple":t.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":t.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){t.removeAttribute("xlink:href");break}e=Dn(""+l),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",e);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(e,""+l):t.removeAttribute(e);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(e,""):t.removeAttribute(e);break;case"capture":case"download":l===!0?t.setAttribute(e,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(e,l):t.removeAttribute(e);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?t.setAttribute(e,l):t.removeAttribute(e);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?t.removeAttribute(e):t.setAttribute(e,l);break;case"popover":K("beforetoggle",t),K("toggle",t),Mn(t,"popover",l);break;case"xlinkActuate":Da(t,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Da(t,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Da(t,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Da(t,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Da(t,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Da(t,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Da(t,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Da(t,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Da(t,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Mn(t,"is",l);break;case"innerText":case"textContent":break;default:(!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(e=tp.get(e)||e,Mn(t,e,l))}}function Xc(t,a,e,l,n,i){switch(e){case"style":Hr(t,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(p(61));if(e=l.__html,e!=null){if(n.children!=null)throw Error(p(60));t.innerHTML=e}}break;case"children":typeof l=="string"?Fe(t,l):(typeof l=="number"||typeof l=="bigint")&&Fe(t,""+l);break;case"onScroll":l!=null&&K("scroll",t);break;case"onScrollEnd":l!=null&&K("scrollend",t);break;case"onClick":l!=null&&(t.onclick=Ca);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Or.hasOwnProperty(e))t:{if(e[0]==="o"&&e[1]==="n"&&(n=e.endsWith("Capture"),a=e.slice(2,n?e.length-7:void 0),i=t[Vt]||null,i=i!=null?i[e]:null,typeof i=="function"&&t.removeEventListener(a,i,n),typeof l=="function")){typeof i!="function"&&i!==null&&(e in t?t[e]=null:t.hasAttribute(e)&&t.removeAttribute(e)),t.addEventListener(a,l,n);break t}e in t?t[e]=l:l===!0?t.setAttribute(e,""):Mn(t,e,l)}}}function Ut(t,a,e){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":K("error",t),K("load",t);var l=!1,n=!1,i;for(i in e)if(e.hasOwnProperty(i)){var u=e[i];if(u!=null)switch(i){case"src":l=!0;break;case"srcSet":n=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(p(137,a));default:rt(t,a,i,u,e,null)}}n&&rt(t,a,"srcSet",e.srcSet,e,null),l&&rt(t,a,"src",e.src,e,null);return;case"input":K("invalid",t);var c=i=u=n=null,f=null,h=null;for(l in e)if(e.hasOwnProperty(l)){var y=e[l];if(y!=null)switch(l){case"name":n=y;break;case"type":u=y;break;case"checked":f=y;break;case"defaultChecked":h=y;break;case"value":i=y;break;case"defaultValue":c=y;break;case"children":case"dangerouslySetInnerHTML":if(y!=null)throw Error(p(137,a));break;default:rt(t,a,l,y,e,null)}}Cr(t,i,c,f,h,u,n,!1);return;case"select":K("invalid",t),l=u=i=null;for(n in e)if(e.hasOwnProperty(n)&&(c=e[n],c!=null))switch(n){case"value":i=c;break;case"defaultValue":u=c;break;case"multiple":l=c;default:rt(t,a,n,c,e,null)}a=i,e=u,t.multiple=!!l,a!=null?Je(t,!!l,a,!1):e!=null&&Je(t,!!l,e,!0);return;case"textarea":K("invalid",t),i=n=l=null;for(u in e)if(e.hasOwnProperty(u)&&(c=e[u],c!=null))switch(u){case"value":l=c;break;case"defaultValue":n=c;break;case"children":i=c;break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(p(91));break;default:rt(t,a,u,c,e,null)}Ur(t,l,n,i);return;case"option":for(f in e)if(e.hasOwnProperty(f)&&(l=e[f],l!=null))switch(f){case"selected":t.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:rt(t,a,f,l,e,null)}return;case"dialog":K("beforetoggle",t),K("toggle",t),K("cancel",t),K("close",t);break;case"iframe":case"object":K("load",t);break;case"video":case"audio":for(l=0;l<dn.length;l++)K(dn[l],t);break;case"image":K("error",t),K("load",t);break;case"details":K("toggle",t);break;case"embed":case"source":case"link":K("error",t),K("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(h in e)if(e.hasOwnProperty(h)&&(l=e[h],l!=null))switch(h){case"children":case"dangerouslySetInnerHTML":throw Error(p(137,a));default:rt(t,a,h,l,e,null)}return;default:if(eu(a)){for(y in e)e.hasOwnProperty(y)&&(l=e[y],l!==void 0&&Xc(t,a,y,l,e,void 0));return}}for(c in e)e.hasOwnProperty(c)&&(l=e[c],l!=null&&rt(t,a,c,l,e,null))}function jg(t,a,e,l){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var n=null,i=null,u=null,c=null,f=null,h=null,y=null;for(v in e){var E=e[v];if(e.hasOwnProperty(v)&&E!=null)switch(v){case"checked":break;case"value":break;case"defaultValue":f=E;default:l.hasOwnProperty(v)||rt(t,a,v,null,l,E)}}for(var m in l){var v=l[m];if(E=e[m],l.hasOwnProperty(m)&&(v!=null||E!=null))switch(m){case"type":i=v;break;case"name":n=v;break;case"checked":h=v;break;case"defaultChecked":y=v;break;case"value":u=v;break;case"defaultValue":c=v;break;case"children":case"dangerouslySetInnerHTML":if(v!=null)throw Error(p(137,a));break;default:v!==E&&rt(t,a,m,v,l,E)}}tu(t,u,c,f,h,y,i,n);return;case"select":v=u=c=m=null;for(i in e)if(f=e[i],e.hasOwnProperty(i)&&f!=null)switch(i){case"value":break;case"multiple":v=f;default:l.hasOwnProperty(i)||rt(t,a,i,null,l,f)}for(n in l)if(i=l[n],f=e[n],l.hasOwnProperty(n)&&(i!=null||f!=null))switch(n){case"value":m=i;break;case"defaultValue":c=i;break;case"multiple":u=i;default:i!==f&&rt(t,a,n,i,l,f)}a=c,e=u,l=v,m!=null?Je(t,!!e,m,!1):!!l!=!!e&&(a!=null?Je(t,!!e,a,!0):Je(t,!!e,e?[]:"",!1));return;case"textarea":v=m=null;for(c in e)if(n=e[c],e.hasOwnProperty(c)&&n!=null&&!l.hasOwnProperty(c))switch(c){case"value":break;case"children":break;default:rt(t,a,c,null,l,n)}for(u in l)if(n=l[u],i=e[u],l.hasOwnProperty(u)&&(n!=null||i!=null))switch(u){case"value":m=n;break;case"defaultValue":v=n;break;case"children":break;case"dangerouslySetInnerHTML":if(n!=null)throw Error(p(91));break;default:n!==i&&rt(t,a,u,n,l,i)}Rr(t,m,v);return;case"option":for(var M in e)if(m=e[M],e.hasOwnProperty(M)&&m!=null&&!l.hasOwnProperty(M))switch(M){case"selected":t.selected=!1;break;default:rt(t,a,M,null,l,m)}for(f in l)if(m=l[f],v=e[f],l.hasOwnProperty(f)&&m!==v&&(m!=null||v!=null))switch(f){case"selected":t.selected=m&&typeof m!="function"&&typeof m!="symbol";break;default:rt(t,a,f,m,l,v)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var B in e)m=e[B],e.hasOwnProperty(B)&&m!=null&&!l.hasOwnProperty(B)&&rt(t,a,B,null,l,m);for(h in l)if(m=l[h],v=e[h],l.hasOwnProperty(h)&&m!==v&&(m!=null||v!=null))switch(h){case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(p(137,a));break;default:rt(t,a,h,m,l,v)}return;default:if(eu(a)){for(var ft in e)m=e[ft],e.hasOwnProperty(ft)&&m!==void 0&&!l.hasOwnProperty(ft)&&Xc(t,a,ft,void 0,l,m);for(y in l)m=l[y],v=e[y],!l.hasOwnProperty(y)||m===v||m===void 0&&v===void 0||Xc(t,a,y,m,l,v);return}}for(var d in e)m=e[d],e.hasOwnProperty(d)&&m!=null&&!l.hasOwnProperty(d)&&rt(t,a,d,null,l,m);for(E in l)m=l[E],v=e[E],!l.hasOwnProperty(E)||m===v||m==null&&v==null||rt(t,a,E,m,l,v)}function qs(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Og(){if(typeof performance.getEntriesByType=="function"){for(var t=0,a=0,e=performance.getEntriesByType("resource"),l=0;l<e.length;l++){var n=e[l],i=n.transferSize,u=n.initiatorType,c=n.duration;if(i&&c&&qs(u)){for(u=0,c=n.responseEnd,l+=1;l<e.length;l++){var f=e[l],h=f.startTime;if(h>c)break;var y=f.transferSize,E=f.initiatorType;y&&qs(E)&&(f=f.responseEnd,u+=y*(f<c?1:(c-h)/(f-h)))}if(--l,a+=8*(i+u)/(n.duration/1e3),t++,10<t)break}}if(0<t)return a/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Qc=null,Zc=null;function ji(t){return t.nodeType===9?t:t.ownerDocument}function Gs(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Xs(t,a){if(t===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&a==="foreignObject"?0:t}function Vc(t,a){return t==="textarea"||t==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var Kc=null;function Mg(){var t=window.event;return t&&t.type==="popstate"?t===Kc?!1:(Kc=t,!0):(Kc=null,!1)}var Qs=typeof setTimeout=="function"?setTimeout:void 0,wg=typeof clearTimeout=="function"?clearTimeout:void 0,Zs=typeof Promise=="function"?Promise:void 0,_g=typeof queueMicrotask=="function"?queueMicrotask:typeof Zs<"u"?function(t){return Zs.resolve(null).then(t).catch(Dg)}:Qs;function Dg(t){setTimeout(function(){throw t})}function me(t){return t==="head"}function Vs(t,a){var e=a,l=0;do{var n=e.nextSibling;if(t.removeChild(e),n&&n.nodeType===8)if(e=n.data,e==="/$"||e==="/&"){if(l===0){t.removeChild(n),Nl(a);return}l--}else if(e==="$"||e==="$?"||e==="$~"||e==="$!"||e==="&")l++;else if(e==="html")gn(t.ownerDocument.documentElement);else if(e==="head"){e=t.ownerDocument.head,gn(e);for(var i=e.firstChild;i;){var u=i.nextSibling,c=i.nodeName;i[_l]||c==="SCRIPT"||c==="STYLE"||c==="LINK"&&i.rel.toLowerCase()==="stylesheet"||e.removeChild(i),i=u}}else e==="body"&&gn(t.ownerDocument.body);e=n}while(e);Nl(a)}function Ks(t,a){var e=t;t=0;do{var l=e.nextSibling;if(e.nodeType===1?a?(e._stashedDisplay=e.style.display,e.style.display="none"):(e.style.display=e._stashedDisplay||"",e.getAttribute("style")===""&&e.removeAttribute("style")):e.nodeType===3&&(a?(e._stashedText=e.nodeValue,e.nodeValue=""):e.nodeValue=e._stashedText||""),l&&l.nodeType===8)if(e=l.data,e==="/$"){if(t===0)break;t--}else e!=="$"&&e!=="$?"&&e!=="$~"&&e!=="$!"||t++;e=l}while(e)}function kc(t){var a=t.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var e=a;switch(a=a.nextSibling,e.nodeName){case"HTML":case"HEAD":case"BODY":kc(e),Ii(e);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(e.rel.toLowerCase()==="stylesheet")continue}t.removeChild(e)}}function Cg(t,a,e,l){for(;t.nodeType===1;){var n=e;if(t.nodeName.toLowerCase()!==a.toLowerCase()){if(!l&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(l){if(!t[_l])switch(a){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(i=t.getAttribute("rel"),i==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(i!==n.rel||t.getAttribute("href")!==(n.href==null||n.href===""?null:n.href)||t.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin)||t.getAttribute("title")!==(n.title==null?null:n.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(i=t.getAttribute("src"),(i!==(n.src==null?null:n.src)||t.getAttribute("type")!==(n.type==null?null:n.type)||t.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin))&&i&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(a==="input"&&t.type==="hidden"){var i=n.name==null?null:""+n.name;if(n.type==="hidden"&&t.getAttribute("name")===i)return t}else return t;if(t=va(t.nextSibling),t===null)break}return null}function Rg(t,a,e){if(a==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=va(t.nextSibling),t===null))return null;return t}function ks(t,a){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=va(t.nextSibling),t===null))return null;return t}function Jc(t){return t.data==="$?"||t.data==="$~"}function Fc(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function Ug(t,a){var e=t.ownerDocument;if(t.data==="$~")t._reactRetry=a;else if(t.data!=="$?"||e.readyState!=="loading")a();else{var l=function(){a(),e.removeEventListener("DOMContentLoaded",l)};e.addEventListener("DOMContentLoaded",l),t._reactRetry=l}}function va(t){for(;t!=null;t=t.nextSibling){var a=t.nodeType;if(a===1||a===3)break;if(a===8){if(a=t.data,a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"||a==="F!"||a==="F")break;if(a==="/$"||a==="/&")return null}}return t}var Wc=null;function Js(t){t=t.nextSibling;for(var a=0;t;){if(t.nodeType===8){var e=t.data;if(e==="/$"||e==="/&"){if(a===0)return va(t.nextSibling);a--}else e!=="$"&&e!=="$!"&&e!=="$?"&&e!=="$~"&&e!=="&"||a++}t=t.nextSibling}return null}function Fs(t){t=t.previousSibling;for(var a=0;t;){if(t.nodeType===8){var e=t.data;if(e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"){if(a===0)return t;a--}else e!=="/$"&&e!=="/&"||a++}t=t.previousSibling}return null}function Ws(t,a,e){switch(a=ji(e),t){case"html":if(t=a.documentElement,!t)throw Error(p(452));return t;case"head":if(t=a.head,!t)throw Error(p(453));return t;case"body":if(t=a.body,!t)throw Error(p(454));return t;default:throw Error(p(451))}}function gn(t){for(var a=t.attributes;a.length;)t.removeAttributeNode(a[0]);Ii(t)}var ya=new Map,$s=new Set;function Oi(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Fa=N.d;N.d={f:Bg,r:Hg,D:Yg,C:Lg,L:qg,m:Gg,X:Qg,S:Xg,M:Zg};function Bg(){var t=Fa.f(),a=yi();return t||a}function Hg(t){var a=Ve(t);a!==null&&a.tag===5&&a.type==="form"?go(a):Fa.r(t)}var El=typeof document>"u"?null:document;function Is(t,a,e){var l=El;if(l&&typeof a=="string"&&a){var n=sa(a);n='link[rel="'+t+'"][href="'+n+'"]',typeof e=="string"&&(n+='[crossorigin="'+e+'"]'),$s.has(n)||($s.add(n),t={rel:t,crossOrigin:e,href:a},l.querySelector(n)===null&&(a=l.createElement("link"),Ut(a,"link",t),Ot(a),l.head.appendChild(a)))}}function Yg(t){Fa.D(t),Is("dns-prefetch",t,null)}function Lg(t,a){Fa.C(t,a),Is("preconnect",t,a)}function qg(t,a,e){Fa.L(t,a,e);var l=El;if(l&&t&&a){var n='link[rel="preload"][as="'+sa(a)+'"]';a==="image"&&e&&e.imageSrcSet?(n+='[imagesrcset="'+sa(e.imageSrcSet)+'"]',typeof e.imageSizes=="string"&&(n+='[imagesizes="'+sa(e.imageSizes)+'"]')):n+='[href="'+sa(t)+'"]';var i=n;switch(a){case"style":i=Tl(t);break;case"script":i=Al(t)}ya.has(i)||(t=U({rel:"preload",href:a==="image"&&e&&e.imageSrcSet?void 0:t,as:a},e),ya.set(i,t),l.querySelector(n)!==null||a==="style"&&l.querySelector(hn(i))||a==="script"&&l.querySelector(mn(i))||(a=l.createElement("link"),Ut(a,"link",t),Ot(a),l.head.appendChild(a)))}}function Gg(t,a){Fa.m(t,a);var e=El;if(e&&t){var l=a&&typeof a.as=="string"?a.as:"script",n='link[rel="modulepreload"][as="'+sa(l)+'"][href="'+sa(t)+'"]',i=n;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=Al(t)}if(!ya.has(i)&&(t=U({rel:"modulepreload",href:t},a),ya.set(i,t),e.querySelector(n)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(e.querySelector(mn(i)))return}l=e.createElement("link"),Ut(l,"link",t),Ot(l),e.head.appendChild(l)}}}function Xg(t,a,e){Fa.S(t,a,e);var l=El;if(l&&t){var n=Ke(l).hoistableStyles,i=Tl(t);a=a||"default";var u=n.get(i);if(!u){var c={loading:0,preload:null};if(u=l.querySelector(hn(i)))c.loading=5;else{t=U({rel:"stylesheet",href:t,"data-precedence":a},e),(e=ya.get(i))&&$c(t,e);var f=u=l.createElement("link");Ot(f),Ut(f,"link",t),f._p=new Promise(function(h,y){f.onload=h,f.onerror=y}),f.addEventListener("load",function(){c.loading|=1}),f.addEventListener("error",function(){c.loading|=2}),c.loading|=4,Mi(u,a,l)}u={type:"stylesheet",instance:u,count:1,state:c},n.set(i,u)}}}function Qg(t,a){Fa.X(t,a);var e=El;if(e&&t){var l=Ke(e).hoistableScripts,n=Al(t),i=l.get(n);i||(i=e.querySelector(mn(n)),i||(t=U({src:t,async:!0},a),(a=ya.get(n))&&Ic(t,a),i=e.createElement("script"),Ot(i),Ut(i,"link",t),e.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Zg(t,a){Fa.M(t,a);var e=El;if(e&&t){var l=Ke(e).hoistableScripts,n=Al(t),i=l.get(n);i||(i=e.querySelector(mn(n)),i||(t=U({src:t,async:!0,type:"module"},a),(a=ya.get(n))&&Ic(t,a),i=e.createElement("script"),Ot(i),Ut(i,"link",t),e.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Ps(t,a,e,l){var n=(n=Z.current)?Oi(n):null;if(!n)throw Error(p(446));switch(t){case"meta":case"title":return null;case"style":return typeof e.precedence=="string"&&typeof e.href=="string"?(a=Tl(e.href),e=Ke(n).hoistableStyles,l=e.get(a),l||(l={type:"style",instance:null,count:0,state:null},e.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(e.rel==="stylesheet"&&typeof e.href=="string"&&typeof e.precedence=="string"){t=Tl(e.href);var i=Ke(n).hoistableStyles,u=i.get(t);if(u||(n=n.ownerDocument||n,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(t,u),(i=n.querySelector(hn(t)))&&!i._p&&(u.instance=i,u.state.loading=5),ya.has(t)||(e={rel:"preload",as:"style",href:e.href,crossOrigin:e.crossOrigin,integrity:e.integrity,media:e.media,hrefLang:e.hrefLang,referrerPolicy:e.referrerPolicy},ya.set(t,e),i||Vg(n,t,e,u.state))),a&&l===null)throw Error(p(528,""));return u}if(a&&l!==null)throw Error(p(529,""));return null;case"script":return a=e.async,e=e.src,typeof e=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=Al(e),e=Ke(n).hoistableScripts,l=e.get(a),l||(l={type:"script",instance:null,count:0,state:null},e.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(p(444,t))}}function Tl(t){return'href="'+sa(t)+'"'}function hn(t){return'link[rel="stylesheet"]['+t+"]"}function td(t){return U({},t,{"data-precedence":t.precedence,precedence:null})}function Vg(t,a,e,l){t.querySelector('link[rel="preload"][as="style"]['+a+"]")?l.loading=1:(a=t.createElement("link"),l.preload=a,a.addEventListener("load",function(){return l.loading|=1}),a.addEventListener("error",function(){return l.loading|=2}),Ut(a,"link",e),Ot(a),t.head.appendChild(a))}function Al(t){return'[src="'+sa(t)+'"]'}function mn(t){return"script[async]"+t}function ad(t,a,e){if(a.count++,a.instance===null)switch(a.type){case"style":var l=t.querySelector('style[data-href~="'+sa(e.href)+'"]');if(l)return a.instance=l,Ot(l),l;var n=U({},e,{"data-href":e.href,"data-precedence":e.precedence,href:null,precedence:null});return l=(t.ownerDocument||t).createElement("style"),Ot(l),Ut(l,"style",n),Mi(l,e.precedence,t),a.instance=l;case"stylesheet":n=Tl(e.href);var i=t.querySelector(hn(n));if(i)return a.state.loading|=4,a.instance=i,Ot(i),i;l=td(e),(n=ya.get(n))&&$c(l,n),i=(t.ownerDocument||t).createElement("link"),Ot(i);var u=i;return u._p=new Promise(function(c,f){u.onload=c,u.onerror=f}),Ut(i,"link",l),a.state.loading|=4,Mi(i,e.precedence,t),a.instance=i;case"script":return i=Al(e.src),(n=t.querySelector(mn(i)))?(a.instance=n,Ot(n),n):(l=e,(n=ya.get(i))&&(l=U({},e),Ic(l,n)),t=t.ownerDocument||t,n=t.createElement("script"),Ot(n),Ut(n,"link",l),t.head.appendChild(n),a.instance=n);case"void":return null;default:throw Error(p(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(l=a.instance,a.state.loading|=4,Mi(l,e.precedence,t));return a.instance}function Mi(t,a,e){for(var l=e.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),n=l.length?l[l.length-1]:null,i=n,u=0;u<l.length;u++){var c=l[u];if(c.dataset.precedence===a)i=c;else if(i!==n)break}i?i.parentNode.insertBefore(t,i.nextSibling):(a=e.nodeType===9?e.head:e,a.insertBefore(t,a.firstChild))}function $c(t,a){t.crossOrigin==null&&(t.crossOrigin=a.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=a.referrerPolicy),t.title==null&&(t.title=a.title)}function Ic(t,a){t.crossOrigin==null&&(t.crossOrigin=a.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=a.referrerPolicy),t.integrity==null&&(t.integrity=a.integrity)}var wi=null;function ed(t,a,e){if(wi===null){var l=new Map,n=wi=new Map;n.set(e,l)}else n=wi,l=n.get(e),l||(l=new Map,n.set(e,l));if(l.has(t))return l;for(l.set(t,null),e=e.getElementsByTagName(t),n=0;n<e.length;n++){var i=e[n];if(!(i[_l]||i[_t]||t==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var u=i.getAttribute(a)||"";u=t+u;var c=l.get(u);c?c.push(i):l.set(u,[i])}}return l}function ld(t,a,e){t=t.ownerDocument||t,t.head.insertBefore(e,a==="title"?t.querySelector("head > title"):null)}function Kg(t,a,e){if(e===1||a.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;switch(a.rel){case"stylesheet":return t=a.disabled,typeof a.precedence=="string"&&t==null;default:return!0}case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function nd(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function kg(t,a,e,l){if(e.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(e.state.loading&4)===0){if(e.instance===null){var n=Tl(l.href),i=a.querySelector(hn(n));if(i){a=i._p,a!==null&&typeof a=="object"&&typeof a.then=="function"&&(t.count++,t=_i.bind(t),a.then(t,t)),e.state.loading|=4,e.instance=i,Ot(i);return}i=a.ownerDocument||a,l=td(l),(n=ya.get(n))&&$c(l,n),i=i.createElement("link"),Ot(i);var u=i;u._p=new Promise(function(c,f){u.onload=c,u.onerror=f}),Ut(i,"link",l),e.instance=i}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(e,a),(a=e.state.preload)&&(e.state.loading&3)===0&&(t.count++,e=_i.bind(t),a.addEventListener("load",e),a.addEventListener("error",e))}}var Pc=0;function Jg(t,a){return t.stylesheets&&t.count===0&&Ci(t,t.stylesheets),0<t.count||0<t.imgCount?function(e){var l=setTimeout(function(){if(t.stylesheets&&Ci(t,t.stylesheets),t.unsuspend){var i=t.unsuspend;t.unsuspend=null,i()}},6e4+a);0<t.imgBytes&&Pc===0&&(Pc=62500*Og());var n=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Ci(t,t.stylesheets),t.unsuspend)){var i=t.unsuspend;t.unsuspend=null,i()}},(t.imgBytes>Pc?50:800)+a);return t.unsuspend=e,function(){t.unsuspend=null,clearTimeout(l),clearTimeout(n)}}:null}function _i(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Ci(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Di=null;function Ci(t,a){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Di=new Map,a.forEach(Fg,t),Di=null,_i.call(t))}function Fg(t,a){if(!(a.state.loading&4)){var e=Di.get(t);if(e)var l=e.get(null);else{e=new Map,Di.set(t,e);for(var n=t.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<n.length;i++){var u=n[i];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(e.set(u.dataset.precedence,u),l=u)}l&&e.set(null,l)}n=a.instance,u=n.getAttribute("data-precedence"),i=e.get(u)||l,i===l&&e.set(null,n),e.set(u,n),this.count++,l=_i.bind(this),n.addEventListener("load",l),n.addEventListener("error",l),i?i.parentNode.insertBefore(n,i.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(n,t.firstChild)),a.state.loading|=4}}var xn={$$typeof:Bt,Provider:null,Consumer:null,_currentValue:Y,_currentValue2:Y,_threadCount:0};function Wg(t,a,e,l,n,i,u,c,f){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ji(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ji(0),this.hiddenUpdates=Ji(null),this.identifierPrefix=l,this.onUncaughtError=n,this.onCaughtError=i,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=f,this.incompleteTransitions=new Map}function id(t,a,e,l,n,i,u,c,f,h,y,E){return t=new Wg(t,a,e,u,f,h,y,E,c),a=1,i===!0&&(a|=24),i=ea(3,null,null,a),t.current=i,i.stateNode=t,a=Du(),a.refCount++,t.pooledCache=a,a.refCount++,i.memoizedState={element:l,isDehydrated:e,cache:a},Bu(i),t}function ud(t){return t?(t=el,t):el}function cd(t,a,e,l,n,i){n=ud(n),l.context===null?l.context=n:l.pendingContext=n,l=ie(a),l.payload={element:e},i=i===void 0?null:i,i!==null&&(l.callback=i),e=ue(t,l,a),e!==null&&($t(e,t,a),Jl(e,t,a))}function rd(t,a){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var e=t.retryLane;t.retryLane=e!==0&&e<a?e:a}}function tr(t,a){rd(t,a),(t=t.alternate)&&rd(t,a)}function fd(t){if(t.tag===13||t.tag===31){var a=Me(t,67108864);a!==null&&$t(a,t,67108864),tr(t,67108864)}}function od(t){if(t.tag===13||t.tag===31){var a=ca();a=Fi(a);var e=Me(t,a);e!==null&&$t(e,t,a),tr(t,a)}}var Ri=!0;function $g(t,a,e,l){var n=b.T;b.T=null;var i=N.p;try{N.p=2,ar(t,a,e,l)}finally{N.p=i,b.T=n}}function Ig(t,a,e,l){var n=b.T;b.T=null;var i=N.p;try{N.p=8,ar(t,a,e,l)}finally{N.p=i,b.T=n}}function ar(t,a,e,l){if(Ri){var n=er(l);if(n===null)Gc(t,a,l,Ui,e),dd(t,l);else if(th(n,t,a,e,l))l.stopPropagation();else if(dd(t,l),a&4&&-1<Pg.indexOf(t)){for(;n!==null;){var i=Ve(n);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var u=Te(i.pendingLanes);if(u!==0){var c=i;for(c.pendingLanes|=2,c.entangledLanes|=2;u;){var f=1<<31-ta(u);c.entanglements[1]|=f,u&=~f}wa(i),(at&6)===0&&(xi=It()+500,sn(0))}}break;case 31:case 13:c=Me(i,2),c!==null&&$t(c,i,2),yi(),tr(i,2)}if(i=er(l),i===null&&Gc(t,a,l,Ui,e),i===n)break;n=i}n!==null&&l.stopPropagation()}else Gc(t,a,l,null,e)}}function er(t){return t=nu(t),lr(t)}var Ui=null;function lr(t){if(Ui=null,t=Ze(t),t!==null){var a=H(t);if(a===null)t=null;else{var e=a.tag;if(e===13){if(t=k(a),t!==null)return t;t=null}else if(e===31){if(t=ht(a),t!==null)return t;t=null}else if(e===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;t=null}else a!==t&&(t=null)}}return Ui=t,null}function sd(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Yd()){case xr:return 2;case vr:return 8;case Tn:case Ld:return 32;case yr:return 268435456;default:return 32}default:return 32}}var nr=!1,xe=null,ve=null,ye=null,vn=new Map,yn=new Map,be=[],Pg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function dd(t,a){switch(t){case"focusin":case"focusout":xe=null;break;case"dragenter":case"dragleave":ve=null;break;case"mouseover":case"mouseout":ye=null;break;case"pointerover":case"pointerout":vn.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":yn.delete(a.pointerId)}}function bn(t,a,e,l,n,i){return t===null||t.nativeEvent!==i?(t={blockedOn:a,domEventName:e,eventSystemFlags:l,nativeEvent:i,targetContainers:[n]},a!==null&&(a=Ve(a),a!==null&&fd(a)),t):(t.eventSystemFlags|=l,a=t.targetContainers,n!==null&&a.indexOf(n)===-1&&a.push(n),t)}function th(t,a,e,l,n){switch(a){case"focusin":return xe=bn(xe,t,a,e,l,n),!0;case"dragenter":return ve=bn(ve,t,a,e,l,n),!0;case"mouseover":return ye=bn(ye,t,a,e,l,n),!0;case"pointerover":var i=n.pointerId;return vn.set(i,bn(vn.get(i)||null,t,a,e,l,n)),!0;case"gotpointercapture":return i=n.pointerId,yn.set(i,bn(yn.get(i)||null,t,a,e,l,n)),!0}return!1}function pd(t){var a=Ze(t.target);if(a!==null){var e=H(a);if(e!==null){if(a=e.tag,a===13){if(a=k(e),a!==null){t.blockedOn=a,Ar(t.priority,function(){od(e)});return}}else if(a===31){if(a=ht(e),a!==null){t.blockedOn=a,Ar(t.priority,function(){od(e)});return}}else if(a===3&&e.stateNode.current.memoizedState.isDehydrated){t.blockedOn=e.tag===3?e.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Bi(t){if(t.blockedOn!==null)return!1;for(var a=t.targetContainers;0<a.length;){var e=er(t.nativeEvent);if(e===null){e=t.nativeEvent;var l=new e.constructor(e.type,e);lu=l,e.target.dispatchEvent(l),lu=null}else return a=Ve(e),a!==null&&fd(a),t.blockedOn=e,!1;a.shift()}return!0}function gd(t,a,e){Bi(t)&&e.delete(a)}function ah(){nr=!1,xe!==null&&Bi(xe)&&(xe=null),ve!==null&&Bi(ve)&&(ve=null),ye!==null&&Bi(ye)&&(ye=null),vn.forEach(gd),yn.forEach(gd)}function Hi(t,a){t.blockedOn===a&&(t.blockedOn=null,nr||(nr=!0,x.unstable_scheduleCallback(x.unstable_NormalPriority,ah)))}var Yi=null;function hd(t){Yi!==t&&(Yi=t,x.unstable_scheduleCallback(x.unstable_NormalPriority,function(){Yi===t&&(Yi=null);for(var a=0;a<t.length;a+=3){var e=t[a],l=t[a+1],n=t[a+2];if(typeof l!="function"){if(lr(l||e)===null)continue;break}var i=Ve(e);i!==null&&(t.splice(a,3),a-=3,ec(i,{pending:!0,data:n,method:e.method,action:l},l,n))}}))}function Nl(t){function a(f){return Hi(f,t)}xe!==null&&Hi(xe,t),ve!==null&&Hi(ve,t),ye!==null&&Hi(ye,t),vn.forEach(a),yn.forEach(a);for(var e=0;e<be.length;e++){var l=be[e];l.blockedOn===t&&(l.blockedOn=null)}for(;0<be.length&&(e=be[0],e.blockedOn===null);)pd(e),e.blockedOn===null&&be.shift();if(e=(t.ownerDocument||t).$$reactFormReplay,e!=null)for(l=0;l<e.length;l+=3){var n=e[l],i=e[l+1],u=n[Vt]||null;if(typeof i=="function")u||hd(e);else if(u){var c=null;if(i&&i.hasAttribute("formAction")){if(n=i,u=i[Vt]||null)c=u.formAction;else if(lr(n)!==null)continue}else c=u.action;typeof c=="function"?e[l+1]=c:(e.splice(l,3),l-=3),hd(e)}}}function md(){function t(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(u){return n=u})},focusReset:"manual",scroll:"manual"})}function a(){n!==null&&(n(),n=null),l||setTimeout(e,20)}function e(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,n=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",a),navigation.addEventListener("navigateerror",a),setTimeout(e,100),function(){l=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",a),navigation.removeEventListener("navigateerror",a),n!==null&&(n(),n=null)}}}function ir(t){this._internalRoot=t}Li.prototype.render=ir.prototype.render=function(t){var a=this._internalRoot;if(a===null)throw Error(p(409));var e=a.current,l=ca();cd(e,l,t,a,null,null)},Li.prototype.unmount=ir.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var a=t.containerInfo;cd(t.current,2,null,t,null,null),yi(),a[Qe]=null}};function Li(t){this._internalRoot=t}Li.prototype.unstable_scheduleHydration=function(t){if(t){var a=Tr();t={blockedOn:null,target:t,priority:a};for(var e=0;e<be.length&&a!==0&&a<be[e].priority;e++);be.splice(e,0,t),e===0&&pd(t)}};var xd=O.version;if(xd!=="19.2.1")throw Error(p(527,xd,"19.2.1"));N.findDOMNode=function(t){var a=t._reactInternals;if(a===void 0)throw typeof t.render=="function"?Error(p(188)):(t=Object.keys(t).join(","),Error(p(268,t)));return t=S(a),t=t!==null?J(t):null,t=t===null?null:t.stateNode,t};var eh={bundleType:0,version:"19.2.1",rendererPackageName:"react-dom",currentDispatcherRef:b,reconcilerVersion:"19.2.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var qi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!qi.isDisabled&&qi.supportsFiber)try{Ol=qi.inject(eh),Pt=qi}catch{}}return zn.createRoot=function(t,a){if(!R(t))throw Error(p(299));var e=!1,l="",n=To,i=Ao,u=No;return a!=null&&(a.unstable_strictMode===!0&&(e=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(n=a.onUncaughtError),a.onCaughtError!==void 0&&(i=a.onCaughtError),a.onRecoverableError!==void 0&&(u=a.onRecoverableError)),a=id(t,1,!1,null,null,e,l,null,n,i,u,md),t[Qe]=a.current,qc(t),new ir(a)},zn.hydrateRoot=function(t,a,e){if(!R(t))throw Error(p(299));var l=!1,n="",i=To,u=Ao,c=No,f=null;return e!=null&&(e.unstable_strictMode===!0&&(l=!0),e.identifierPrefix!==void 0&&(n=e.identifierPrefix),e.onUncaughtError!==void 0&&(i=e.onUncaughtError),e.onCaughtError!==void 0&&(u=e.onCaughtError),e.onRecoverableError!==void 0&&(c=e.onRecoverableError),e.formState!==void 0&&(f=e.formState)),a=id(t,1,!0,a,e??null,l,n,f,i,u,c,md),a.context=ud(null),e=a.current,l=ca(),l=Fi(l),n=ie(l),n.callback=null,ue(e,n,l),e=l,a.current.lanes=e,wl(a,e),wa(a),t[Qe]=a.current,qc(t),new Li(a)},zn.version="19.2.1",zn}var jd;function ph(){if(jd)return rr.exports;jd=1;function x(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(x)}catch(O){console.error(O)}}return x(),rr.exports=dh(),rr.exports}var gh=ph();const hh=Dd(gh);const mh=x=>x.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),xh=x=>x.replace(/^([A-Z])|[\s-_]+(\w)/g,(O,C,p)=>p?p.toUpperCase():C.toLowerCase()),Od=x=>{const O=xh(x);return O.charAt(0).toUpperCase()+O.slice(1)},Cd=(...x)=>x.filter((O,C,p)=>!!O&&O.trim()!==""&&p.indexOf(O)===C).join(" ").trim(),vh=x=>{for(const O in x)if(O.startsWith("aria-")||O==="role"||O==="title")return!0};var yh={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const bh=xt.forwardRef(({color:x="currentColor",size:O=24,strokeWidth:C=2,absoluteStrokeWidth:p,className:R="",children:H,iconNode:k,...ht},A)=>xt.createElement("svg",{ref:A,...yh,width:O,height:O,stroke:x,strokeWidth:p?Number(C)*24/Number(O):C,className:Cd("lucide",R),...!H&&!vh(ht)&&{"aria-hidden":"true"},...ht},[...k.map(([S,J])=>xt.createElement(S,J)),...Array.isArray(H)?H:[H]]));const wt=(x,O)=>{const C=xt.forwardRef(({className:p,...R},H)=>xt.createElement(bh,{ref:H,iconNode:O,className:Cd(`lucide-${mh(Od(x))}`,`lucide-${x}`,p),...R}));return C.displayName=Od(x),C};const Sh=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],zh=wt("arrow-right",Sh);const Eh=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],Th=wt("chevron-down",Eh);const Ah=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Md=wt("chevron-right",Ah);const Nh=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],jh=wt("facebook",Nh);const Oh=[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]],Mh=wt("gift",Oh);const wh=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],pr=wt("heart",wh);const _h=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],Dh=wt("instagram",_h);const Ch=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],Rh=wt("linkedin",Ch);const Uh=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],Bh=wt("mail",Uh);const Hh=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],Yh=wt("map-pin",Hh);const Lh=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],qh=wt("maximize-2",Lh);const Gh=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Xh=wt("menu",Gh);const Qh=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],Zh=wt("phone",Qh);const Vh=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],Kh=wt("search",Vh);const kh=[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]],Gi=wt("shopping-cart",kh);const Jh=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],Fh=wt("twitter",Jh);const Wh=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],dr=wt("user",Wh);const $h=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Rd=wt("x",$h),wd=[{title:"All Products",items:[]},{title:"Document Printing",items:["Certificates","Academic Documents","Forms & Reports"]},{title:"Marketing Prints",items:["Posters","Flyers","Business Cards","Brochures"]},{title:"Clothing & Apparel",items:["T-Shirts","Hoodies","Caps","Jerseys","School Uniforms","Sportswear","Sublimated T-Shirts","Church Uniforms"]},{title:"Personalized Gifts",items:["Mugs","Bottles","Keyholders","Mousepads","Coasters","Pillows","Canvas Prints"]},{title:"Large Format & Outdoor",items:["PVC Banners","Roll-Up Banners","Posters","Stickers","Vehicle Branding","Signboards","Wallpaper","Window Graphics","Flags","Gazebo","X-Banner","Correx Board"]}],_d=({isMobileMenuOpen:x=!1,onCategorySelect:O})=>{const[C,p]=xt.useState(null),[R,H]=xt.useState(null),[k,ht]=xt.useState(!1),A=xt.useRef(!1),S=xt.useRef(null);xt.useEffect(()=>{const Q=()=>{ht(window.innerWidth<=768)};return Q(),window.addEventListener("resize",Q),()=>window.removeEventListener("resize",Q)},[]),xt.useEffect(()=>{const Q=()=>{A.current=!0,C!==null&&p(null),S.current&&clearTimeout(S.current),S.current=setTimeout(()=>{A.current=!1},150)};return window.addEventListener("scroll",Q,{passive:!0}),()=>{window.removeEventListener("scroll",Q),S.current&&clearTimeout(S.current)}},[C]);const J=Q=>{H(R===Q?null:Q)},U=(Q,lt)=>{O&&O(Q,lt),console.log(`Selected: ${Q}${lt?` > ${lt}`:""}`)},dt=Q=>{A.current||p(Q)},Yt=()=>{p(null)};return k&&x?r.jsxs("div",{className:"mobile-categories",children:[r.jsx("style",{children:`
          .mobile-categories {
            width: 100%;
            margin-top: 8px;
          }

          .mobile-category-item {
            width: 100%;
            margin-bottom: 4px;
          }

          .mobile-category-header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: var(--neutral-light);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: var(--transition);
            font-size: 15px;
            font-weight: 500;
            color: var(--neutral-dark);
            text-align: left;
          }

          .mobile-category-header:hover {
            background: var(--primary-pink);
            color: var(--white);
          }

          .mobile-category-header.active {
            background: var(--primary-pink);
            color: var(--white);
          }

          .mobile-category-title {
            flex: 1;
          }

          .mobile-chevron {
            width: 20px;
            height: 20px;
            transition: var(--transition);
            flex-shrink: 0;
          }

          .mobile-category-header.active .mobile-chevron {
            transform: rotate(90deg);
          }

          .mobile-subcategories {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding-left: 12px;
          }

          .mobile-subcategories.active {
            max-height: 800px;
            margin-top: 8px;
          }

          .mobile-subcategory-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            margin-bottom: 4px;
            background: rgba(233, 30, 99, 0.05);
            border-radius: 10px;
            cursor: pointer;
            transition: var(--transition);
            font-size: 14px;
            color: var(--neutral-dark);
          }

          .mobile-subcategory-item:hover {
            background: linear-gradient(135deg, rgba(233, 30, 99, 0.15), rgba(247, 181, 0, 0.15));
            color: var(--primary-pink);
            transform: translateX(4px);
          }

          .mobile-subcategory-item svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: 0.6;
          }
        `}),wd.map((Q,lt)=>r.jsxs("div",{className:"mobile-category-item",children:[r.jsxs("button",{className:`mobile-category-header ${R===lt?"active":""}`,onClick:()=>{Q.items.length>0?J(lt):U(Q.title)},children:[r.jsx("span",{className:"mobile-category-title",children:Q.title}),Q.items.length>0&&r.jsx(Md,{className:"mobile-chevron"})]}),Q.items.length>0&&r.jsx("div",{className:`mobile-subcategories ${R===lt?"active":""}`,children:Q.items.map((ra,Lt)=>r.jsxs("div",{className:"mobile-subcategory-item",onClick:()=>U(Q.title,ra),children:[r.jsx(Md,{}),r.jsx("span",{children:ra})]},Lt))})]},lt))]}):r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
          --transition: all 0.25s ease;
          --container-max-width: 1280px;
          --container-padding: 48px;
        }

        /* MAIN BAR WRAPPER */
        .category-bar-wrapper {
          width: 100%;
          background: var(--white);
          border-bottom: 1px solid #e6e6e6;
          position: sticky;
          top: 0;
          z-index: 1000;
          isolation: isolate;
        }

        /* MAIN BAR */
        .category-bar {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 12px var(--container-padding);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        /* CATEGORY ITEM */
        .category-item {
          position: relative;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: var(--neutral-dark);
          transition: var(--transition);
          white-space: nowrap;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 1001;
        }

        .category-item:hover {
          color: var(--primary-pink);
          background: var(--neutral-light);
        }

        .category-item.no-dropdown {
          padding: 8px 16px;
        }

        /* CHEVRON ICON */
        .chevron-icon {
          width: 16px;
          height: 16px;
          transition: var(--transition);
        }

        .category-item:hover .chevron-icon {
          transform: rotate(180deg);
        }

        /* HOVER BRIDGE - prevents dropdown from closing */
        .category-item::before {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          height: 12px;
          background: transparent;
          z-index: 10000;
        }

        /* DESKTOP DROPDOWN - NO TRANSITIONS TO PREVENT FLICKER */
        .dropdown {
          position: fixed;
          background: var(--white);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          padding: 16px;
          min-width: 240px;
          max-width: 320px;
          display: none;
          border: 1px solid #e6e6e6;
          z-index: 10001;
        }

        .dropdown.show {
          display: block;
        }

        /* MULTI-COLUMN FOR LARGE DROPDOWNS */
        .dropdown.large {
          min-width: 380px;
          max-width: 480px;
          display: none;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .dropdown.large.show {
          display: grid;
        }

        /* DROPDOWN ITEM */
        .dropdown-item {
          padding: 10px 14px;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
          color: var(--neutral-dark);
          border-radius: 8px;
          font-weight: 400;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, rgba(233, 30, 99, 0.08), rgba(247, 181, 0, 0.08));
          color: var(--primary-pink);
          transform: translateX(4px);
        }

        /* TABLET RESPONSIVE */
        @media (max-width: 1024px) {
          .category-bar {
            --container-padding: 24px;
            gap: 16px;
            justify-content: flex-start;
            overflow-x: auto;
            overflow-y: hidden;
            flex-wrap: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .category-bar::-webkit-scrollbar {
            display: none;
          }

          .category-item {
            font-size: 14px;
            padding: 8px 10px;
          }

          .dropdown {
            min-width: 220px;
            max-width: 280px;
          }

          .dropdown.large {
            min-width: 320px;
            max-width: 400px;
            grid-template-columns: 1fr;
          }
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .category-bar-wrapper {
            display: none;
          }
        }

        /* ACCESSIBILITY */
        .category-item:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        .dropdown-item:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: -2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsx("nav",{className:"category-bar-wrapper",role:"navigation","aria-label":"Product categories",children:r.jsx("div",{className:"category-bar",children:wd.map((Q,lt)=>r.jsx(Ih,{category:Q,index:lt,isActive:C===lt,onMouseEnter:()=>dt(lt),onMouseLeave:Yt,handleItemClick:U},lt))})})]})},Ih=({category:x,isActive:O,onMouseEnter:C,onMouseLeave:p,handleItemClick:R})=>{const H=xt.useRef(null),[k,ht]=xt.useState({});return xt.useEffect(()=>{if(O&&H.current){const A=H.current.getBoundingClientRect();ht({top:`${A.bottom+8}px`,left:`${A.left+A.width/2}px`,transform:"translateX(-50%)"})}},[O]),r.jsxs("div",{ref:H,className:`category-item ${x.items.length===0?"no-dropdown":""}`,onMouseEnter:C,onMouseLeave:p,onClick:()=>x.items.length===0&&R(x.title),role:"button",tabIndex:0,"aria-expanded":x.items.length>0?O:void 0,"aria-haspopup":x.items.length>0,children:[r.jsx("span",{children:x.title}),x.items.length>0&&r.jsx(Th,{className:"chevron-icon"}),x.items.length>0&&r.jsx("div",{className:`dropdown ${x.items.length>8?"large":""} ${O?"show":""}`,style:k,role:"menu",children:x.items.map((A,S)=>r.jsx("div",{className:"dropdown-item",onClick:J=>{J.stopPropagation(),R(x.title,A)},role:"menuitem",tabIndex:0,children:A},S))})]})},Ph=()=>{const[x,O]=xt.useState(!0);return x?r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --white: #FFFFFF;
          --transition: all 0.3s ease;
        }

        .announcement-bar {
          width: 100%;
          background: linear-gradient(135deg, var(--primary-pink) 0%, #D81B60 50%, var(--primary-gold) 100%);
          color: var(--white);
          padding: 10px 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 11;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.15);
        }

        .announcement-text {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .announcement-highlight {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255, 255, 255, 0.25);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .close-announcement {
          position: absolute;
          right: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: var(--white);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .close-announcement:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .announcement-bar {
            padding: 10px 32px;
          }
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .announcement-bar {
            padding: 10px 16px;
            font-size: 13px;
          }

          .announcement-text {
            padding-right: 32px;
          }

          .close-announcement {
            right: 12px;
            width: 26px;
            height: 26px;
          }
        }

        @media (max-width: 480px) {
          .announcement-bar {
            padding: 8px 12px;
            font-size: 10px;
          }

          .announcement-text {
            gap: 4px;
            padding-right: 28px;
          }

          .announcement-highlight {
            padding: 2px 6px;
            font-size: 11px;
          }

          .close-announcement {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 375px) {
          .announcement-bar {
            font-size: 9px;
            padding: 7px 10px;
          }

          .announcement-text {
            gap: 4px;
          }
        }

        @media (max-width: 320px) {
          .announcement-bar {
            font-size: 8px;
            padding: 6px 8px;
          }

          .announcement-highlight {
            padding: 1px 5px;
          }

          .close-announcement {
            width: 22px;
            height: 22px;
            right: 8px;
          }
        }
      `}),r.jsxs("div",{className:"announcement-bar",children:[r.jsx("div",{className:"announcement-text",children:r.jsx("span",{children:"🎉 Free Shipping on orders over $50 Use code: WELCOME25"})}),r.jsx("button",{className:"close-announcement",onClick:()=>O(!1),"aria-label":"Close announcement",children:r.jsx(Rd,{size:16})})]})]}):null},t0=()=>{const[x,O]=xt.useState(""),[C,p]=xt.useState(!1),R=k=>{k&&k.preventDefault(),console.log("Searching for:",x)},H=k=>{k.key==="Enter"&&R()};return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --accent-blue: #4A90E2;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #ECF0F1;
          --white: #FFFFFF;
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
          --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
          --container-max-width: 1280px;
          --container-padding: 48px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-width: 320px;
        }

        /* STICKY CONTAINER FOR ANNOUNCEMENT + HEADER */
        .header-sticky-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--white);
        }

        /* HEADER WRAPPER - Full width background */
        .header-wrapper {
          width: 100%;
          background: var(--white);
          border-bottom: 3px solid transparent;
          border-image: linear-gradient(90deg, var(--primary-pink), var(--primary-gold)) 1;
          box-shadow: var(--shadow-md);
          position: relative;
        }

        /* HEADER CONTAINER - Constrained content */
        .header {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 16px var(--container-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* CATEGORY NAV WRAPPER - NO TRANSITIONS */
        .category-nav-wrapper {
          /* Removed all transitions to prevent flickering */
        }

        /* LOGO */
        .logo-container {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo {
          height: 100px;
          width: auto;
          cursor: pointer;
          transition: var(--transition);
        }

        .logo:hover {
          transform: scale(1.05);
        }

        /* SEARCH BAR - Centered and properly sized */
        .search-wrapper {
          flex: 1;
          max-width: 560px;
          display: flex;
          justify-content: center;
          min-width: 0;
        }

        .search-bar {
          width: 100%;
          background: #ecfbfdff;
          padding: 12px 20px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid transparent;
          transition: var(--transition);
          min-width: 0;
        }

        .search-bar:focus-within {
          background: var(--white);
          border-color: var(--primary-pink);
          box-shadow: 0 0 0 4px rgba(233, 30, 140, 0.15);
        }

        .search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 15px;
          color: var(--neutral-dark);
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--neutral-medium);
        }

        .search-btn {
          border: none;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .search-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(233, 30, 140, 0.3);
        }

        /* RIGHT SECTION */
        .right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .icon-btn {
          border: none;
          background: var(--neutral-light);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          color: var(--neutral-dark);
          position: relative;
          flex-shrink: 0;
        }

        .icon-btn:hover {
          background: var(--white);
          border: 2px solid var(--primary-pink);
          color: var(--primary-pink);
          transform: translateY(-2px);
        }

        .icon-btn.cart-btn {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
        }

        .icon-btn.cart-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px rgba(233, 30, 140, 0.3);
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff4757;
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        /* PROFILE */
        .profile-box {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          padding: 6px 16px 6px 6px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: var(--transition);
          color: white;
          border: none;
          flex-shrink: 0;
        }

        .profile-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(233, 30, 140, 0.25);
        }

        .profile-name {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-pink);
          flex-shrink: 0;
        }

        /* MOBILE MENU BUTTON */
        .mobile-menu-btn {
          display: none;
          border: none;
          background: var(--neutral-light);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--neutral-dark);
          transition: var(--transition);
          flex-shrink: 0;
        }

        .mobile-menu-btn:hover {
          background: var(--primary-pink);
          color: var(--white);
        }

        /* MOBILE OVERLAY */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          opacity: 0;
          pointer-events: none;
          transition: var(--transition);
          z-index: 9998;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* MOBILE MENU - FULL SCREEN */
        .mobile-menu {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          background: white;
          padding: 0;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 9999;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid var(--neutral-light);
          flex-shrink: 0;
          background: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-menu-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--neutral-dark);
        }

        .close-menu-btn {
          border: none;
          background: var(--neutral-light);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--neutral-dark);
          transition: var(--transition);
        }

        .close-menu-btn:hover {
          background: var(--primary-pink);
          color: var(--white);
        }

        /* Scrollable content area */
        .mobile-menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          padding-bottom: 40px;
        }

        .mobile-menu-profile {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          color: white;
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.2);
        }

        .mobile-menu-profile .avatar {
          width: 56px;
          height: 56px;
        }

        .mobile-profile-info h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .mobile-profile-info p {
          font-size: 14px;
          opacity: 0.95;
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: 8px;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: var(--neutral-light);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 15px;
          font-weight: 500;
          color: var(--neutral-dark);
          width: 100%;
          text-align: left;
        }

        .mobile-menu-item:hover,
        .mobile-menu-item:active {
          background: var(--primary-pink);
          color: var(--white);
          transform: translateX(4px);
        }

        .mobile-menu-item svg {
          flex-shrink: 0;
        }

        /* MENU SECTION DIVIDER */
        .menu-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          padding: 0 4px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(233, 30, 99, 0.2) 20%,
            rgba(247, 181, 0, 0.2) 80%,
            transparent
          );
        }

        .divider-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--neutral-medium);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          white-space: nowrap;
          padding: 0 8px;
        }

        /* MOBILE MENU CATEGORIES SECTION */
        .mobile-menu-categories {
          margin-top: 0;
        }

        /* LARGE DESKTOP */
        @media (min-width: 1280px) {
          .header {
            gap: 40px;
          }
        }

        /* TABLET RESPONSIVE */
        @media (max-width: 1024px) {
          .header {
            --container-padding: 32px;
            gap: 24px;
          }

          .search-wrapper {
            max-width: 400px;
          }

          .logo {
            height: 70px;
          }
        }

        /* MOBILE RESPONSIVE - 768px */
        @media (max-width: 768px) {
          .header {
            --container-padding: 16px;
            padding: 20px 16px;
            gap: 12px;
          }

          .search-wrapper {
            flex: 1;
            max-width: 400px;
          }

          .search-bar {
            padding: 10px 16px;
          }

          .search-input {
            font-size: 14px;
          }

          .search-btn {
            width: 32px;
            height: 32px;
          }

          .icon-btn {
            width: 40px;
            height: 40px;
          }

          .icon-btn.cart-btn {
            display: flex;
          }

          .profile-box,
          .right .icon-btn:not(.cart-btn) {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          /* Hide category nav on mobile */
          .category-nav-wrapper {
            display: none;
          }
        }

        /* SMALL MOBILE - 480px */
        @media (max-width: 480px) {
          .header {
            padding: 10px 12px;
            gap: 8px;
          }

          .logo {
            height: 50px;
          }

          .search-input {
            font-size: 11px;
          }

          .search-wrapper {
            max-width: 200px;
          }

          .search-bar {
            padding: 4px 14px;
            gap: 8px;
          }

          .search-btn {
            width: 30px;
            height: 30px;
          }

          .icon-btn {
            width: 38px;
            height: 38px;
          }

          .mobile-menu-btn {
            width: 38px;
            height: 38px;
          }

          .cart-badge {
            font-size: 10px;
            padding: 2px 5px;
            min-width: 16px;
          }
        }

        /* EXTRA SMALL MOBILE - 375px */
        @media (max-width: 375px) {
          .header {
            padding: 8px 10px;
            gap: 6px;
          }

          .logo {
            height: 40px;
          }

          .search-bar {
            padding: 7px 12px;
            gap: 6px;
          }


          .search-input::placeholder {
            font-size: 12px;
          }

          .search-btn {
            width: 28px;
            height: 28px;
          }

          .icon-btn,
          .mobile-menu-btn {
            width: 36px;
            height: 36px;
          }
        }

        /* MINIMUM SUPPORT - 320px */
        @media (max-width: 320px) {
          .header {
            padding: 8px 8px;
            gap: 4px;
          }

          .logo {
            height: 28px;
          }

          .search-bar {
            padding: 6px 10px;
            gap: 6px;
          }

          .search-input {
            font-size: 11px;
          }

          .search-input::placeholder {
            font-size: 11px;
          }

          .search-btn {
            width: 26px;
            height: 26px;
          }

          .search-btn svg {
            width: 14px;
            height: 14px;
          }

          .icon-btn,
          .mobile-menu-btn {
            width: 34px;
            height: 34px;
          }

          .icon-btn svg,
          .mobile-menu-btn svg {
            width: 18px;
            height: 18px;
          }

          .cart-badge {
            font-size: 9px;
            padding: 1px 4px;
            min-width: 14px;
            top: -2px;
            right: -2px;
          }
        }

        /* ACCESSIBILITY */
        .search-btn:focus,
        .icon-btn:focus,
        .profile-box:focus,
        .mobile-menu-btn:focus,
        .close-menu-btn:focus {
          outline: 3px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsxs("div",{className:"header-sticky-container",children:[r.jsx(Ph,{}),r.jsx("header",{className:"header-wrapper",children:r.jsxs("div",{className:"header",children:[r.jsx("div",{className:"logo-container",children:r.jsx("img",{src:"assets/logo.png",alt:"Seach Clothing & Printing",className:"logo"})}),r.jsx("div",{className:"search-wrapper",children:r.jsxs("div",{className:"search-bar",children:[r.jsx("input",{type:"text",placeholder:"Search products...",className:"search-input",value:x,onChange:k=>O(k.target.value),onKeyPress:H}),r.jsx("button",{className:"search-btn",onClick:R,"aria-label":"Search",children:r.jsx(Kh,{size:18})})]})}),r.jsxs("div",{className:"right",children:[r.jsx("button",{className:"icon-btn","aria-label":"Wishlist",children:r.jsx(pr,{size:20})}),r.jsxs("button",{className:"icon-btn cart-btn","aria-label":"Shopping cart",children:[r.jsx(Gi,{size:20}),r.jsx("span",{className:"cart-badge",children:"3"})]}),r.jsxs("button",{className:"profile-box","aria-label":"User profile",children:[r.jsx("span",{className:"profile-name",children:"Ryman Alex"}),r.jsx("div",{className:"avatar",children:r.jsx(dr,{size:20})})]})]}),r.jsx("button",{className:"mobile-menu-btn",onClick:()=>p(!0),"aria-label":"Open menu",children:r.jsx(Xh,{size:20})})]})}),r.jsx("div",{className:"category-nav-wrapper",children:r.jsx(_d,{})})]}),r.jsx("div",{className:`mobile-overlay ${C?"open":""}`,onClick:()=>p(!1)}),r.jsxs("div",{className:`mobile-menu ${C?"open":""}`,children:[r.jsxs("div",{className:"mobile-menu-header",children:[r.jsx("span",{className:"mobile-menu-title",children:"Menu"}),r.jsx("button",{className:"close-menu-btn",onClick:()=>p(!1),"aria-label":"Close menu",children:r.jsx(Rd,{size:22})})]}),r.jsxs("div",{className:"mobile-menu-content",children:[r.jsxs("div",{className:"mobile-menu-profile",children:[r.jsx("div",{className:"avatar",children:r.jsx(dr,{size:28})}),r.jsxs("div",{className:"mobile-profile-info",children:[r.jsx("h3",{children:"Ryman Alex"}),r.jsx("p",{children:"View Profile"})]})]}),r.jsxs("div",{className:"mobile-menu-actions",children:[r.jsxs("button",{className:"mobile-menu-item",children:[r.jsx(pr,{size:20}),r.jsx("span",{children:"Wishlist"})]}),r.jsxs("button",{className:"mobile-menu-item",children:[r.jsx(dr,{size:20}),r.jsx("span",{children:"Account Settings"})]})]}),r.jsxs("div",{className:"menu-section-divider",children:[r.jsx("div",{className:"divider-line"}),r.jsx("span",{className:"divider-text",children:"Browse Categories"}),r.jsx("div",{className:"divider-line"})]}),r.jsx("div",{className:"mobile-menu-categories",children:r.jsx(_d,{isMobileMenuOpen:C})})]})]})]})},a0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --transition: all 0.25s ease;
          --container-max-width: 1280px;
          --container-padding: 48px;
        }

        .footer-wrapper {
          width: 100%;
          background: linear-gradient(180deg, var(--white) 0%, var(--neutral-light) 100%);
          margin-top: 60px;
          padding-top: 48px;
          border-top: 4px solid transparent;
          border-image: linear-gradient(90deg, var(--primary-pink), var(--primary-gold)) 1;
        }

        .footer {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
          padding-bottom: 40px;
        }

        /* COLUMN HEADINGS */
        .footer h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* LINKS */
        .footer ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer li {
          margin-bottom: 12px;
          color: var(--neutral-dark);
          font-size: 15px;
          cursor: pointer;
          transition: var(--transition);
          padding-left: 0;
        }

        .footer li:hover {
          color: var(--primary-pink);
          transform: translateX(4px);
        }

        /* CONTACT DETAILS */
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 15px;
          color: var(--neutral-dark);
          line-height: 1.5;
        }

        .contact-item svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--primary-pink);
        }

        .contact-item a {
          color: var(--neutral-dark);
          text-decoration: none;
          transition: var(--transition);
        }

        .contact-item a:hover {
          color: var(--primary-pink);
        }

        /* SOCIAL ICONS */
        .social-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .social-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          border: 2px solid var(--neutral-light);
          color: var(--neutral-dark);
          text-decoration: none;
        }

        .social-icon:hover {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          border-color: transparent;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
        }

        /* COPYRIGHT BAR */
        .copyright {
          margin-top: 0;
          padding: 20px var(--container-padding);
          text-align: center;
          background: linear-gradient(135deg, rgba(233, 30, 99, 0.05), rgba(247, 181, 0, 0.05));
          color: var(--neutral-medium);
          font-size: 14px;
          border-top: 1px solid rgba(233, 30, 99, 0.1);
          line-height: 1.6;
        }

        .copyright a {
          color: var(--primary-pink);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }

        .copyright a:hover {
          color: var(--primary-gold);
        }

        /* TABLET RESPONSIVE */
        @media (max-width: 1024px) {
          .footer-wrapper {
            --container-padding: 32px;
          }

          .footer {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        /* MOBILE RESPONSIVE - CLEAN SINGLE COLUMN */
        @media (max-width: 768px) {
          .footer-wrapper {
            --container-padding: 24px;
            margin-top: 48px;
            padding-top: 40px;
          }

          .footer {
            margin-left: 15px;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .footer h3 {
            font-size: 17px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(233, 30, 99, 0.1);
          }

          .footer li {
            font-size: 14px;
            margin-bottom: 11px;
          }

          .contact-item {
            font-size: 14px;
            margin-bottom: 14px;
          }

          .social-row {
            gap: 14px;
          }

          .social-icon {
            width: 46px;
            height: 46px;
          }

          .copyright {
            font-size: 13px;
            padding: 20px 24px;
            line-height: 1.7;
          }
        }

        @media (max-width: 480px) {
          .footer-wrapper {
            --container-padding: 20px;
            padding-top: 36px;
          }

          .footer {
            grid-template-columns: 1fr;
            gap: 36px;
          }


          .footer h3 {
            font-size: 16px;
            margin-bottom: 14px;
            padding-bottom: 8px;
          }

          .footer li {
            margin-left: 20px;
            font-size: 13px;
            margin-bottom: 10px;
          }

          .contact-item {
            font-size: 13px;
            margin-bottom: 12px;
            gap: 10px;
          }

          .social-row {
            gap: 12px;
          }

          .social-icon {
            width: 44px;
            height: 44px;
          }

          .copyright {
            font-size: 12px;
            padding: 18px 20px;
          }
        }

        @media (max-width: 375px) {
          .footer-wrapper {
            --container-padding: 16px;
          }

          .footer {
            gap: 32px;
          }

          .footer h3 {
            font-size: 15px;
            margin-bottom: 12px;
          }

          .footer li,
          .contact-item {
            font-size: 12px;
          }

          .social-icon {
            width: 42px;
            height: 42px;
          }

          .social-row {
            gap: 10px;
          }
        }

        @media (max-width: 320px) {
          .footer-wrapper {
            --container-padding: 14px;
            padding-top: 28px;
          }

          .footer {
            gap: 28px;
            padding-bottom: 28px;
          }

          .footer h3 {
            font-size: 14px;
            margin-bottom: 10px;
            padding-bottom: 6px;
          }

          .footer li,
          .contact-item {
            font-size: 11px;
            margin-bottom: 9px;
          }

          .social-icon {
            width: 40px;
            height: 40px;
          }

          .copyright {
            font-size: 11px;
            padding: 16px 14px;
          }
        }

        /* ACCESSIBILITY */
        .footer li:focus,
        .social-icon:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsxs("div",{className:"footer-wrapper",children:[r.jsxs("div",{className:"footer",children:[r.jsxs("div",{children:[r.jsx("h3",{children:"Company"}),r.jsxs("ul",{children:[r.jsx("li",{children:"About Us"}),r.jsx("li",{children:"Why Choose Us"}),r.jsx("li",{children:"Printing Technology"}),r.jsx("li",{children:"Contact"}),r.jsx("li",{children:"Careers"})]})]}),r.jsxs("div",{children:[r.jsx("h3",{children:"Services"}),r.jsxs("ul",{children:[r.jsx("li",{children:"Document Printing"}),r.jsx("li",{children:"Marketing Prints"}),r.jsx("li",{children:"Clothing & Apparel"}),r.jsx("li",{children:"Personalized Gifts"}),r.jsx("li",{children:"Large Format Printing"}),r.jsx("li",{children:"Bulk Orders"})]})]}),r.jsxs("div",{children:[r.jsx("h3",{children:"Support"}),r.jsxs("ul",{children:[r.jsx("li",{children:"FAQs"}),r.jsx("li",{children:"Order Tracking"}),r.jsx("li",{children:"Shipping & Delivery"}),r.jsx("li",{children:"Returns & Refunds"}),r.jsx("li",{children:"Artwork Guidelines"}),r.jsx("li",{children:"Size Charts"})]})]}),r.jsxs("div",{children:[r.jsx("h3",{children:"Contact Us"}),r.jsxs("div",{className:"contact-item",children:[r.jsx(Zh,{size:18}),r.jsx("a",{href:"tel:+27987654321",children:"+27 98765 43210"})]}),r.jsxs("div",{className:"contact-item",children:[r.jsx(Bh,{size:18}),r.jsx("a",{href:"mailto:support@seachprinting.com",children:"support@seachprinting.com"})]}),r.jsxs("div",{className:"contact-item",children:[r.jsx(Yh,{size:18}),r.jsxs("span",{children:["7 Grysbkleen Noord,",r.jsx("br",{}),"Rustenburg, South Africa"]})]}),r.jsxs("div",{className:"social-row",children:[r.jsx("a",{href:"https://facebook.com",className:"social-icon","aria-label":"Facebook",children:r.jsx(jh,{size:20})}),r.jsx("a",{href:"https://instagram.com",className:"social-icon","aria-label":"Instagram",children:r.jsx(Dh,{size:20})}),r.jsx("a",{href:"https://twitter.com",className:"social-icon","aria-label":"Twitter",children:r.jsx(Fh,{size:20})}),r.jsx("a",{href:"https://linkedin.com",className:"social-icon","aria-label":"LinkedIn",children:r.jsx(Rh,{size:20})})]})]})]}),r.jsxs("div",{className:"copyright",children:["© ",new Date().getFullYear()," Seach Clothing & Printing. All rights reserved.",r.jsx("br",{}),"Powered by"," ",r.jsx("a",{href:"https://software.pedzaworks.com",target:"_blank",rel:"noopener noreferrer",children:"Pedzaworks Software Solutions"})]})]})]}),e0=()=>{const x=["assets/print2.jpg","assets/print1.jpg","assets/print3.jpg"],[O,C]=xt.useState(0),p=xt.useRef(null),R=()=>{p.current=setTimeout(()=>{C(A=>(A+1)%x.length)},5e3)};xt.useEffect(()=>(R(),()=>{p.current&&clearTimeout(p.current)}),[O]),xt.useEffect(()=>{const A=()=>{};return window.addEventListener("scroll",A,{passive:!0}),()=>window.removeEventListener("scroll",A)},[]);const H=A=>{C(A)},k=()=>{C(A=>(A-1+x.length)%x.length)},ht=()=>{C(A=>(A+1)%x.length)};return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --white: #FFFFFF;
          --container-max-width: 1280px;
          --container-padding: 48px;
          --transition: all 0.3s ease;
        }

        /* FULL WIDTH BACKGROUND */
        .carousel-outer {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 20px 0 0 0;
          background: #ffffff;
          position: relative;
          z-index: 1; /* Lower than nav dropdown */
        }

        /* MATCHES HEADER WIDTH */
        .carousel-inner {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        /* IMAGE AREA CONTAINER */
        .carousel-wrapper {
          width: 100%;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          background: #f5f5f5;
          isolation: isolate; /* Creates new stacking context */
        }

        /* PRINTO-STYLE ASPECT RATIO - Shorter/Wider */
        .carousel-aspect-ratio {
          position: relative;
          width: 100%;
          padding-bottom: 35%; /* Shorter like Printo ~2.85:1 ratio */
          overflow: hidden;
        }

        .carousel-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .carousel-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* SUBTLE GRADIENT OVERLAY */
        .carousel-slide::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.05) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.15) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* NAVIGATION ARROWS */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .carousel-arrow:hover {
          background: var(--white);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 16px rgba(233, 30, 99, 0.3);
        }

        .carousel-arrow.prev {
          left: 24px;
        }

        .carousel-arrow.next {
          right: 24px;
        }

        .carousel-arrow svg {
          width: 24px;
          height: 24px;
          color: var(--neutral-dark);
        }

        /* DOTS */
        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 2;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: var(--transition);
          border: 2px solid transparent;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }

        .dot.active {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          transform: scale(1.3);
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.5);
        }

        /* LARGE DESKTOP */
        @media (min-width: 1440px) {
          .carousel-aspect-ratio {
            padding-bottom: 32%; /* Wider on large screens */
          }
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .carousel-inner {
            --container-padding: 32px;
          }

          .carousel-aspect-ratio {
            padding-bottom: 40%;
          }

          .carousel-arrow {
            width: 44px;
            height: 44px;
          }

          .carousel-arrow.prev {
            left: 20px;
          }

          .carousel-arrow.next {
            right: 20px;
          }
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .carousel-inner {
            --container-padding: 16px;
          }

          .carousel-wrapper {
            border-radius: 12px;
          }

          .carousel-aspect-ratio {
            padding-bottom: 50%;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
          }

          .carousel-arrow.prev {
            left: 16px;
          }

          .carousel-arrow.next {
            right: 16px;
          }

          .carousel-arrow svg {
            width: 20px;
            height: 20px;
          }

          .carousel-dots {
            bottom: 16px;
            gap: 10px;
          }

          .dot {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .carousel-wrapper {
            border-radius: 10px;
          }

          .carousel-aspect-ratio {
            padding-bottom: 60%;
          }

          .carousel-arrow {
            width: 36px;
            height: 36px;
          }

          .carousel-arrow.prev {
            left: 12px;
          }

          .carousel-arrow.next {
            right: 12px;
          }

          .carousel-dots {
            bottom: 12px;
            gap: 8px;
          }

          .dot {
            width: 8px;
            height: 8px;
          }
        }

        @media (max-width: 375px) {
          .carousel-inner {
            --container-padding: 12px;
          }

          .carousel-aspect-ratio {
            padding-bottom: 65%;
          }
        }

        @media (max-width: 320px) {
          .carousel-inner {
            --container-padding: 10px;
          }

          .carousel-wrapper {
            border-radius: 8px;
          }

          .carousel-aspect-ratio {
            padding-bottom: 70%;
          }

          .carousel-arrow {
            width: 32px;
            height: 32px;
          }
        }

        /* ACCESSIBILITY */
        .carousel-arrow:focus,
        .dot:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel-container {
            transition: none;
          }

          .dot,
          .carousel-arrow {
            transition: none;
          }
        }
      `}),r.jsx("div",{className:"carousel-outer",children:r.jsx("div",{className:"carousel-inner",children:r.jsxs("div",{className:"carousel-wrapper",children:[r.jsx("div",{className:"carousel-aspect-ratio",children:r.jsx("div",{className:"carousel-container",style:{transform:`translateX(-${O*100}%)`},children:x.map((A,S)=>r.jsx("div",{className:"carousel-slide",children:r.jsx("img",{src:A,alt:`Printing service showcase ${S+1}`,className:"carousel-image",loading:S===0?"eager":"lazy"})},S))})}),r.jsx("button",{className:"carousel-arrow prev",onClick:k,"aria-label":"Previous slide",type:"button",children:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})})}),r.jsx("button",{className:"carousel-arrow next",onClick:ht,"aria-label":"Next slide",type:"button",children:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})}),r.jsx("div",{className:"carousel-dots",children:x.map((A,S)=>r.jsx("button",{className:`dot ${O===S?"active":""}`,onClick:()=>H(S),"aria-label":`Go to slide ${S+1}`,type:"button"},S))})]})})})]})},l0=[{title:"Document Printing",img:"assets/document.jpg"},{title:"Marketing Prints",img:"assets/marketing.webp"},{title:"Clothing & Apparel",img:"assets/apparel.jpg"},{title:"Personalized Gifts",img:"assets/gifts.jpg"},{title:"Large Format & Outdoor",img:"assets/outdoor.jpg"}],n0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --container-max-width: 1280px;
          --container-padding: 32px;
        }

        .category-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 40px 0;
        }

        .category-container {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        .category-title {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #2c3e50;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
        }

        .category-card {
          cursor: pointer;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-6px);
        }

        .category-image {
          width: 100%;
          height: 220px;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: 0.3s ease;
        }

        .category-card:hover .category-image {
          opacity: 0.85;
        }

        .category-name {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .category-image {
            height: 190px;
          }
        }

        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .category-image {
            height: 170px;
          }
        }

        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .category-image {
            height: 150px;
            border-radius: 18px;
          }
        }
      `}),r.jsx("div",{className:"category-section",children:r.jsxs("div",{className:"category-container",children:[r.jsx("h2",{className:"category-title",children:"Categories"}),r.jsx("div",{className:"category-grid",children:l0.map((x,O)=>r.jsxs("div",{className:"category-card",children:[r.jsx("img",{src:x.img,alt:x.title,className:"category-image"}),r.jsx("p",{className:"category-name",children:x.title})]},O))})]})})]}),i0=[{title:"Documents Printing",description:"Assignments, Textbooks & Project work",price:"From $6",img:"assets/document.jpg",tag:"Best Seller"},{title:"Custom T-Shirts",description:"Perfect for events, branding & gifts",price:"From $6",img:"assets/t-shirt.jpg",tag:"Best Seller"},{title:"PVC Banners",description:"Durable outdoor promotional banners",price:"From $12",img:"assets/pvc.avif",tag:"Popular"},{title:"Church Uniforms",description:"Custom church wear & fabric sublimation",price:"From $10",img:"assets/pvc.avif",tag:null},{title:"Photo Mugs",description:"Personalized mugs for any occasion",price:"From $5",img:"assets/gifts.jpg",tag:null},{title:"Certificates",description:"High-quality official document printing",price:"From $3",img:"assets/certificate.jpg",tag:null},{title:"Business Cards",description:"Premium quality business cards",price:"From $4",img:"assets/business.jpg",tag:"Popular"},{title:"Custom Hoodies",description:"Warm & stylish branded hoodies",price:"From $15",img:"assets/hoodies.jpg",tag:"New"}],u0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --container-max-width: 1280px;
          --container-padding: 48px;
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --transition: all 0.3s ease;
        }

        .products-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 0;
          background: var(--white);
        }

        .products-container {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        /* SECTION HEADER */
        .products-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .products-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .products-subtitle {
          font-size: 16px;
          color: var(--neutral-medium);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* GRID - 4 COLUMNS ON DESKTOP */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* PRODUCT CARD */
        .product-card {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          border: 1px solid transparent;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
          border-color: rgba(233, 30, 99, 0.2);
        }

        /* IMAGE CONTAINER */
        .product-img-container {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: var(--neutral-light);
          flex-shrink: 0;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: var(--transition);
        }

        .product-card:hover .product-img {
          transform: scale(1.08);
        }

        /* PRODUCT TAG */
        .product-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* WISHLIST BUTTON */
        .wishlist-btn {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          opacity: 0;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .product-card:hover .wishlist-btn {
          opacity: 1;
        }

        .wishlist-btn:hover {
          background: var(--white);
          transform: scale(1.15);
        }

        .wishlist-btn svg {
          width: 18px;
          height: 18px;
          color: var(--primary-pink);
        }

        /* PRODUCT CONTENT */
        .product-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .product-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.3;
          margin: 0;
        }

        .product-description {
          font-size: 13px;
          color: var(--neutral-medium);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        /* PRODUCT FOOTER - SIDE BY SIDE */
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
        }

        .product-price {
          font-size: 18px;
          color: var(--primary-pink);
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .product-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
        }

        .product-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
        }

        .product-btn svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .products-container {
            --container-padding: 32px;
          }

          .products-section {
            padding: 48px 0;
          }

          .products-title {
            font-size: 28px;
          }

          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .product-img-container {
            height: 220px;
          }
        }

        @media (max-width: 768px) {
          .products-container {
            --container-padding: 16px;
          }

          .products-section {
            padding: 40px 0;
          }

          .products-header {
            margin-bottom: 32px;
          }

          .products-title {
            font-size: 24px;
          }

          .products-subtitle {
            font-size: 14px;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .product-img-container {
            height: 200px;
          }

          .product-content {
            padding: 14px;
            gap: 8px;
          }

          .product-title {
            font-size: 14px;
          }

          .product-description {
            font-size: 12px;
            line-height: 1.4;
          }

          .product-footer {
            gap: 8px;
          }

          .product-price {
            font-size: 14px;
          }

          .product-btn {
            padding: 8px 10px;
            font-size: 11px;
            gap: 4px;
          }

          .product-btn svg {
            width: 14px;
            height: 14px;
          }

          .wishlist-btn {
            opacity: 1;
            width: 32px;
            height: 32px;
            top: 10px;
            left: 10px;
          }

          .wishlist-btn svg {
            width: 16px;
            height: 16px;
          }

          .product-tag {
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            font-size: 10px;
          }
        }

        @media (max-width: 430px) {
          .products-section {
            padding: 36px 0;
          }

          .products-header {
            margin-bottom: 28px;
          }

          .products-title {
            font-size: 22px;
          }

          .products-grid {
            gap: 14px;
          }

          .product-img-container {
            height: 180px;
          }

          .product-content {
            padding: 12px;
            gap: 7px;
          }

          .product-title {
            font-size: 13px;
          }

          .product-description {
            font-size: 11px;
          }

          .product-footer {
            gap: 6px;
          }

          .product-price {
            font-size: 13px;
          }

          .product-btn {
            padding: 7px 8px;
            font-size: 10px;
            gap: 3px;
          }

          .product-btn svg {
            width: 13px;
            height: 13px;
          }
        }

        @media (max-width: 390px) {
          .products-container {
            --container-padding: 14px;
          }

          .products-section {
            padding: 32px 0;
          }

          .products-title {
            font-size: 20px;
          }

          .products-subtitle {
            font-size: 13px;
          }

          .products-grid {
            gap: 12px;
          }

          .product-img-container {
            height: 165px;
          }

          .product-content {
            padding: 10px;
            gap: 6px;
          }

          .product-title {
            font-size: 12px;
            line-height: 1.2;
          }

          .product-description {
            font-size: 10px;
            line-height: 1.3;
          }

          .product-footer {
            gap: 5px;
          }

          .product-price {
            font-size: 12px;
          }

          .product-btn {
            padding: 6px 7px;
            font-size: 9px;
            gap: 2px;
            min-width: 0;
          }

          .product-btn svg {
            width: 12px;
            height: 12px;
          }

          .wishlist-btn {
            width: 28px;
            height: 28px;
            top: 8px;
            left: 8px;
          }

          .wishlist-btn svg {
            width: 14px;
            height: 14px;
          }

          .product-tag {
            top: 8px;
            right: 8px;
            padding: 3px 7px;
            font-size: 8px;
          }
        }
        @media (max-width: 375px) {
          .products-container {
            --container-padding: 12px;
          }

          .products-grid {
            gap: 11px;
          }

          .product-img-container {
            height: 155px;
          }

          .product-content {
            padding: 9px;
          }

          .product-title {
            font-size: 11.5px;
          }

          .product-description {
            font-size: 9.5px;
          }

          .product-price {
            font-size: 11.5px;
          }

          .product-btn {
            padding: 5px 6px;
            font-size: 8.5px;
          }
        }

        /* TINY MOBILE - Older iPhones (320px) */
        @media (max-width: 320px) {
          .products-container {
            --container-padding: 10px;
          }

          .products-title {
            font-size: 18px;
          }

          .products-grid {
            gap: 10px;
          }

          .product-img-container {
            height: 140px;
          }

          .product-content {
            padding: 8px;
          }

          .product-title {
            font-size: 11px;
          }

          .product-description {
            font-size: 9px;
          }

          .product-footer {
            gap: 4px;
          }

          .product-price {
            font-size: 11px;
          }

          .product-btn {
            padding: 5px 5px;
            font-size: 8px;
          }

          .product-btn svg {
            width: 11px;
            height: 11px;
          }
        }

        /* ACCESSIBILITY */
        .product-btn:focus,
        .wishlist-btn:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsx("div",{className:"products-section",children:r.jsxs("div",{className:"products-container",children:[r.jsxs("div",{className:"products-header",children:[r.jsx("h2",{className:"products-title",children:"Popular Products"}),r.jsx("p",{className:"products-subtitle",children:"Discover our most loved printing and customization services"})]}),r.jsx("div",{className:"products-grid",children:i0.map((x,O)=>r.jsxs("div",{className:"product-card",children:[r.jsxs("div",{className:"product-img-container",children:[r.jsx("img",{src:x.img,className:"product-img",alt:x.title,loading:O<4?"eager":"lazy"}),r.jsx("button",{className:"wishlist-btn","aria-label":"Add to wishlist",children:r.jsx(pr,{})}),x.tag&&r.jsx("div",{className:"product-tag",children:x.tag})]}),r.jsxs("div",{className:"product-content",children:[r.jsx("h3",{className:"product-title",children:x.title}),r.jsx("p",{className:"product-description",children:x.description}),r.jsxs("div",{className:"product-footer",children:[r.jsx("span",{className:"product-price",children:x.price}),r.jsxs("button",{className:"product-btn",children:[r.jsx(Gi,{}),r.jsx("span",{children:"Customize"})]})]})]})]},O))})]})})]}),c0=[{title:"Custom T-Shirts",description:"Perfect for branding, teams, and events",img:"/apparel/tshirt.jpg",big:!0,tag:"Most Popular"},{title:"Custom Hoodies",description:"Warm, stylish, and fully customizable",img:"/apparel/hoodie.jpg",tag:"Trending"},{title:"Sports Jerseys",description:"Match kits, team wear & performance fabrics",img:"/apparel/jersey.jpg",tag:null},{title:"Sublimated T-Shirts",description:"Durable, vibrant full-print sublimation",img:"/apparel/sublimated.jpg",big:!0,tag:"Premium"},{title:"Church Uniforms",description:"Custom church wear & fabric sublimation",img:"/apparel/church.jpg",tag:null},{title:"Uniforms & Workwear",description:"Corporate uniforms, school wear, staff outfits",img:"/apparel/uniform.jpg",tag:null}],r0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --container-max-width: 1280px;
          --container-padding: 48px;
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --transition: all 0.3s ease;
        }

        .apparel-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 0;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        }

        .apparel-container {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        /* SECTION HEADER - CENTERED */
        .apparel-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .apparel-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        /* GRID - 4 COLUMNS */
        .apparel-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* APPAREL CARD - FIXED STRUCTURE */
        .apparel-card {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          display: grid;
          grid-template-rows: auto 1fr;
          position: relative;
          border: 1px solid transparent;
          height: 100%;
        }

        .apparel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
          border-color: rgba(233, 30, 99, 0.2);
        }

        .apparel-card.big {
          grid-column: span 2;
        }

        /* IMAGE CONTAINER */
        .apparel-img-container {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: var(--neutral-light);
        }

        .apparel-card.big .apparel-img-container {
          height: 300px;
        }

        .apparel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: var(--transition);
        }

        .apparel-card:hover .apparel-img {
          transform: scale(1.08);
        }

        /* TAG */
        .apparel-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* CONTENT - FIXED GAPS */
        .apparel-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .apparel-title-card {
          font-size: 16px;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.3;
          margin: 0;
        }

        .apparel-card.big .apparel-title-card {
          font-size: 18px;
        }

        .apparel-description {
          font-size: 13px;
          color: var(--neutral-medium);
          line-height: 1.5;
          margin: 0;
        }

        .apparel-btn {
          width: 100%;
          padding: 10px 16px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: auto;
        }

        .apparel-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
        }

        .apparel-btn svg {
          width: 16px;
          height: 16px;
        }

        /* EXTRA LARGE DESKTOP */
        @media (min-width: 1600px) {
          .apparel-title {
            font-size: 36px;
          }

          .apparel-grid {
            gap: 28px;
          }

          .apparel-img-container {
            height: 280px;
          }

          .apparel-card.big .apparel-img-container {
            height: 320px;
          }

          .apparel-content {
            padding: 20px;
            gap: 12px;
          }

          .apparel-title-card {
            font-size: 17px;
          }

          .apparel-card.big .apparel-title-card {
            font-size: 20px;
          }

          .apparel-description {
            font-size: 14px;
          }

          .apparel-btn {
            padding: 11px 18px;
            font-size: 14px;
          }
        }

        /* LARGE DESKTOP */
        @media (min-width: 1440px) and (max-width: 1599px) {
          .apparel-title {
            font-size: 34px;
          }

          .apparel-img-container {
            height: 270px;
          }

          .apparel-card.big .apparel-img-container {
            height: 310px;
          }
        }

        /* STANDARD DESKTOP */
        @media (min-width: 1280px) and (max-width: 1439px) {
          .apparel-grid {
            gap: 22px;
          }

          .apparel-img-container {
            height: 250px;
          }

          .apparel-card.big .apparel-img-container {
            height: 290px;
          }
        }

        /* SMALL DESKTOP / LARGE TABLET */
        @media (max-width: 1279px) and (min-width: 1025px) {
          .apparel-container {
            --container-padding: 40px;
          }

          .apparel-header {
            margin-bottom: 40px;
          }

          .apparel-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .apparel-card.big {
            grid-column: span 1;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 240px;
          }
        }

        /* TABLET */
        @media (max-width: 1024px) and (min-width: 769px) {
          .apparel-container {
            --container-padding: 32px;
          }

          .apparel-section {
            padding: 48px 0;
          }

          .apparel-header {
            margin-bottom: 36px;
          }

          .apparel-title {
            font-size: 28px;
          }

          .apparel-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .apparel-card.big {
            grid-column: span 1;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 220px;
          }

          .apparel-content {
            padding: 16px;
          }

          .apparel-title-card,
          .apparel-card.big .apparel-title-card {
            font-size: 15px;
          }

          .apparel-description {
            font-size: 12px;
          }
        }

        /* MOBILE - 2 COLUMNS */
        @media (max-width: 768px) {
          .apparel-container {
            --container-padding: 16px;
          }

          .apparel-section {
            padding: 40px 0;
          }

          .apparel-header {
            margin-bottom: 32px;
          }

          .apparel-title {
            font-size: 24px;
          }

          .apparel-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .apparel-card.big {
            grid-column: span 1;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 180px;
          }

          .apparel-content {
            padding: 14px;
            gap: 8px;
          }

          .apparel-title-card,
          .apparel-card.big .apparel-title-card {
            font-size: 14px;
          }

          .apparel-description {
            font-size: 12px;
          }

          .apparel-btn {
            padding: 9px 14px;
            font-size: 12px;
            gap: 5px;
          }

          .apparel-btn svg {
            width: 14px;
            height: 14px;
          }

          .apparel-tag {
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            font-size: 10px;
          }
        }

        /* SMALL MOBILE */
        @media (max-width: 480px) {
          .apparel-section {
            padding: 36px 0;
          }

          .apparel-header {
            margin-bottom: 28px;
          }

          .apparel-title {
            font-size: 22px;
          }

          .apparel-grid {
            gap: 14px;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 170px;
          }

          .apparel-content {
            padding: 12px;
          }

          .apparel-title-card,
          .apparel-card.big .apparel-title-card {
            font-size: 13px;
          }

          .apparel-description {
            font-size: 11px;
          }
        }

        /* EXTRA SMALL MOBILE */
        @media (max-width: 375px) {
          .apparel-container {
            --container-padding: 12px;
          }

          .apparel-section {
            padding: 32px 0;
          }

          .apparel-title {
            font-size: 20px;
          }

          .apparel-grid {
            gap: 12px;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 160px;
          }

          .apparel-content {
            padding: 10px;
            gap: 6px;
          }

          .apparel-btn {
            padding: 8px 12px;
            font-size: 11px;
          }
        }

        /* TINY MOBILE */
        @media (max-width: 320px) {
          .apparel-title {
            font-size: 18px;
          }

          .apparel-grid {
            gap: 10px;
          }

          .apparel-img-container,
          .apparel-card.big .apparel-img-container {
            height: 140px;
          }

          .apparel-title-card,
          .apparel-card.big .apparel-title-card {
            font-size: 12px;
          }

          .apparel-description {
            font-size: 10px;
          }
        }

        /* ACCESSIBILITY */
        .apparel-btn:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsx("div",{className:"apparel-section",children:r.jsxs("div",{className:"apparel-container",children:[r.jsx("div",{className:"apparel-header",children:r.jsx("h2",{className:"apparel-title",children:"Clothing & Apparel Spotlight"})}),r.jsx("div",{className:"apparel-grid",children:c0.map((x,O)=>r.jsxs("div",{className:`apparel-card ${x.big?"big":""}`,children:[r.jsxs("div",{className:"apparel-img-container",children:[r.jsx("img",{src:x.img,alt:x.title,className:"apparel-img",loading:O<4?"eager":"lazy"}),x.tag&&r.jsx("div",{className:"apparel-tag",children:x.tag})]}),r.jsxs("div",{className:"apparel-content",children:[r.jsx("h3",{className:"apparel-title-card",children:x.title}),r.jsx("p",{className:"apparel-description",children:x.description}),r.jsxs("button",{className:"apparel-btn",children:[r.jsx("span",{children:"Customize Now"}),r.jsx(zh,{})]})]})]},O))})]})})]}),f0=[{title:"Custom Mugs",description:"Perfect for gifts, events, and branding",img:"/gifts/mug.jpg",tag:"Best Seller"},{title:"Personalized Bottles",description:"Durable stainless steel and plastic bottles",img:"/gifts/bottle.jpg",tag:"Popular"},{title:"Keyholders",description:"Engraved and printed keyholders",img:"/gifts/keyholder.jpg",tag:null},{title:"Custom Pillows",description:"Soft, vibrant, and fully customizable",img:"/gifts/pillow.jpg",tag:null},{title:"Canvas Prints",description:"High-quality stretched canvas wall art",img:"/gifts/canvas.jpg",tag:"Trending"},{title:"Coasters & Mousepads",description:"Personalized desk essentials",img:"/gifts/mousepad.jpg",tag:null},{title:"Stationery",description:"High-quality stretched canvas wall art",img:"/gifts/canvas.jpg",tag:"Trending"},{title:"Canvas Prints",description:"High-quality stretched canvas wall art",img:"/gifts/canvas.jpg",tag:"Trending"}],o0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --container-max-width: 1280px;
          --container-padding: 48px;
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --transition: all 0.3s ease;
        }

        .gifts-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 0;
          background: var(--white);
        }

        .gifts-container {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        /* SECTION HEADER */
        .gifts-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .gifts-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .gifts-subtitle {
          font-size: 16px;
          color: var(--neutral-medium);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* GRID - 4 COLUMNS */
        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* GIFT CARD */
        .gifts-card {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          border: 1px solid transparent;
          display: grid;
          grid-template-rows: auto 1fr;
          height: 100%;
        }

        .gifts-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
          border-color: rgba(233, 30, 99, 0.2);
        }

        /* IMAGE CONTAINER */
        .gifts-img-container {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: var(--neutral-light);
        }

        .gifts-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: var(--transition);
        }

        .gifts-card:hover .gifts-img {
          transform: scale(1.08);
        }

        /* GIFT TAG */
        .gifts-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* WISHLIST BUTTON */
        .wishlist-btn {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          opacity: 0;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .gifts-card:hover .wishlist-btn {
          opacity: 1;
        }

        .wishlist-btn:hover {
          background: var(--white);
          transform: scale(1.15);
        }

        .wishlist-btn svg {
          width: 18px;
          height: 18px;
          color: var(--primary-pink);
        }

        /* GIFT CONTENT */
        .gifts-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gifts-title-card {
          font-size: 16px;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.3;
          margin: 0;
        }

        .gifts-description {
          font-size: 13px;
          color: var(--neutral-medium);
          line-height: 1.5;
          margin: 0;
        }

        /* GIFT FOOTER */
        .gifts-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .gifts-btn {
          width: 100%;
          padding: 10px 16px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .gifts-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
        }

        .gifts-btn svg {
          width: 16px;
          height: 16px;
        }

        /* EXTRA LARGE DESKTOP */
        @media (min-width: 1600px) {
          .gifts-grid {
            gap: 28px;
          }

          .gifts-img-container {
            height: 280px;
          }

          .gifts-content {
            padding: 20px;
            gap: 12px;
          }

          .gifts-title-card {
            font-size: 17px;
          }

          .gifts-description {
            font-size: 14px;
          }

          .gifts-btn {
            padding: 11px 18px;
            font-size: 14px;
          }
        }

        /* LARGE DESKTOP */
        @media (min-width: 1440px) and (max-width: 1599px) {
          .gifts-title {
            font-size: 34px;
          }

          .gifts-img-container {
            height: 270px;
          }
        }

        /* STANDARD DESKTOP */
        @media (min-width: 1280px) and (max-width: 1439px) {
          .gifts-grid {
            gap: 22px;
          }

          .gifts-img-container {
            height: 250px;
          }
        }

        /* SMALL DESKTOP / LARGE TABLET */
        @media (max-width: 1279px) and (min-width: 1025px) {
          .gifts-container {
            --container-padding: 40px;
          }

          .gifts-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .gifts-img-container {
            height: 240px;
          }
        }

        /* TABLET */
        @media (max-width: 1024px) and (min-width: 769px) {
          .gifts-container {
            --container-padding: 32px;
          }

          .gifts-section {
            padding: 48px 0;
          }

          .gifts-header {
            margin-bottom: 40px;
          }

          .gifts-title {
            font-size: 28px;
          }

          .gifts-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .gifts-img-container {
            height: 220px;
          }

          .gifts-content {
            padding: 16px;
          }

          .gifts-title-card {
            font-size: 15px;
          }

          .gifts-description {
            font-size: 12px;
          }
        }

        /* MOBILE - 2 COLUMNS */
        @media (max-width: 768px) {
          .gifts-container {
            --container-padding: 16px;
          }

          .gifts-section {
            padding: 40px 0;
          }

          .gifts-header {
            margin-bottom: 32px;
          }

          .gifts-title {
            font-size: 24px;
          }

          .gifts-subtitle {
            font-size: 14px;
          }

          .gifts-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .gifts-img-container {
            height: 180px;
          }

          .gifts-content {
            padding: 14px;
            gap: 8px;
          }

          .gifts-title-card {
            font-size: 14px;
          }

          .gifts-description {
            font-size: 12px;
          }

          .gifts-footer {
            gap: 8px;
          }

          .gifts-btn {
            padding: 9px 14px;
            font-size: 12px;
            gap: 5px;
          }

          .gifts-btn svg {
            width: 14px;
            height: 14px;
          }

          .wishlist-btn {
            opacity: 1;
            width: 34px;
            height: 34px;
            top: 10px;
            left: 10px;
          }

          .wishlist-btn svg {
            width: 16px;
            height: 16px;
          }

          .gifts-tag {
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            font-size: 10px;
          }
        }

        /* SMALL MOBILE */
        @media (max-width: 480px) {
          .gifts-section {
            padding: 36px 0;
          }

          .gifts-header {
            margin-bottom: 28px;
          }

          .gifts-title {
            font-size: 22px;
          }

          .gifts-grid {
            gap: 14px;
          }

          .gifts-img-container {
            height: 170px;
          }

          .gifts-content {
            padding: 12px;
          }

          .gifts-title-card {
            font-size: 13px;
          }

          .gifts-description {
            font-size: 11px;
          }
        }

        /* EXTRA SMALL MOBILE */
        @media (max-width: 375px) {
          .gifts-container {
            --container-padding: 12px;
          }

          .gifts-section {
            padding: 32px 0;
          }

          .gifts-title {
            font-size: 20px;
          }

          .gifts-subtitle {
            font-size: 13px;
          }

          .gifts-grid {
            gap: 12px;
          }

          .gifts-img-container {
            height: 160px;
          }

          .gifts-content {
            padding: 10px;
            gap: 6px;
          }

          .gifts-btn {
            padding: 8px 12px;
            font-size: 11px;
          }
        }

        /* TINY MOBILE */
        @media (max-width: 320px) {
          .gifts-title {
            font-size: 18px;
          }

          .gifts-grid {
            gap: 10px;
          }

          .gifts-img-container {
            height: 140px;
          }

          .gifts-title-card {
            font-size: 12px;
          }

          .gifts-description {
            font-size: 10px;
          }
        }

        /* ACCESSIBILITY */
        .gifts-btn:focus,
        .wishlist-btn:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsx("div",{className:"gifts-section",children:r.jsxs("div",{className:"gifts-container",children:[r.jsxs("div",{className:"gifts-header",children:[r.jsx("h2",{className:"gifts-title",children:"Personalized Gifts & Merchandise"}),r.jsx("p",{className:"gifts-subtitle",children:"Create memorable gifts for every occasion"})]}),r.jsx("div",{className:"gifts-grid",children:f0.map((x,O)=>r.jsxs("div",{className:"gifts-card",children:[r.jsxs("div",{className:"gifts-img-container",children:[r.jsx("img",{src:x.img,className:"gifts-img",alt:x.title,loading:O<4?"eager":"lazy"}),r.jsx("button",{className:"wishlist-btn","aria-label":"Add to wishlist",children:r.jsx(Mh,{})}),x.tag&&r.jsx("div",{className:"gifts-tag",children:x.tag})]}),r.jsxs("div",{className:"gifts-content",children:[r.jsx("h3",{className:"gifts-title-card",children:x.title}),r.jsx("p",{className:"gifts-description",children:x.description}),r.jsx("div",{className:"gifts-footer",children:r.jsxs("button",{className:"gifts-btn",children:[r.jsx(Gi,{}),r.jsx("span",{children:"Customize"})]})})]})]},O))})]})})]}),s0=[{title:"PVC Banners",description:"Durable outdoor promotional banners",img:"/largeformat/pvc-banner.jpg",tag:"Popular"},{title:"Posters",description:"High-quality poster printing",img:"/largeformat/posters.jpg",tag:null},{title:"Roll-Up Banners",description:"Portable display solutions",img:"/largeformat/rollup.jpg",tag:null},{title:"Vehicle Branding",description:"Professional vehicle wraps & decals",img:"/largeformat/vehicle-branding.jpg",tag:"Trending"},{title:"Stickers (Vinyl / Car)",description:"Custom vinyl stickers & car decals",img:"/largeformat/stickers.jpg",tag:null},{title:"Signboards",description:"Custom signage for businesses",img:"/largeformat/signboard.jpg",tag:"Best Seller"},{title:"Wallpapers",description:"Custom signage for businesses",img:"/largeformat/signboard.jpg",tag:"Best Seller"},{title:"Window Graphics",description:"Custom signage for businesses",img:"/largeformat/signboard.jpg",tag:"Best Seller"}],d0=()=>r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
        :root {
          --container-max-width: 1280px;
          --container-padding: 48px;
          --primary-pink: #E91E63;
          --primary-gold: #F7B500;
          --neutral-dark: #2C3E50;
          --neutral-medium: #7F8C8D;
          --neutral-light: #F8F8F8;
          --white: #FFFFFF;
          --transition: all 0.3s ease;
        }

        .lf-section {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 0;
          background: var(--white);
        }

        .lf-container {
          width: 100%;
          max-width: var(--container-max-width);
          padding: 0 var(--container-padding);
        }

        /* SECTION HEADER */
        .lf-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .lf-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .lf-subtitle {
          font-size: 16px;
          color: var(--neutral-medium);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* GRID - 4 COLUMNS */
        .lf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* LF CARD */
        .lf-card {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          border: 1px solid transparent;
          display: grid;
          grid-template-rows: auto 1fr;
          height: 100%;
        }

        .lf-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
          border-color: rgba(233, 30, 99, 0.2);
        }

        /* IMAGE CONTAINER */
        .lf-img-container {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: var(--neutral-light);
        }

        .lf-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: var(--transition);
        }

        .lf-card:hover .lf-img {
          transform: scale(1.08);
        }

        /* LF TAG */
        .lf-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* WISHLIST BUTTON */
        .wishlist-btn {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          opacity: 0;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .lf-card:hover .wishlist-btn {
          opacity: 1;
        }

        .wishlist-btn:hover {
          background: var(--white);
          transform: scale(1.15);
        }

        .wishlist-btn svg {
          width: 18px;
          height: 18px;
          color: var(--primary-pink);
        }

        /* LF CONTENT */
        .lf-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lf-title-card {
          font-size: 16px;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.3;
          margin: 0;
        }

        .lf-description {
          font-size: 13px;
          color: var(--neutral-medium);
          line-height: 1.5;
          margin: 0;
        }

        /* LF FOOTER */
        .lf-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .lf-btn {
          width: 100%;
          padding: 10px 16px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .lf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
        }

        .lf-btn svg {
          width: 16px;
          height: 16px;
        }

        /* EXTRA LARGE DESKTOP */
        @media (min-width: 1600px) {
          .lf-grid {
            gap: 28px;
          }

          .lf-img-container {
            height: 280px;
          }

          .lf-content {
            padding: 20px;
            gap: 12px;
          }

          .lf-title-card {
            font-size: 17px;
          }

          .lf-description {
            font-size: 14px;
          }

          .lf-btn {
            padding: 11px 18px;
            font-size: 14px;
          }
        }

        /* LARGE DESKTOP */
        @media (min-width: 1440px) and (max-width: 1599px) {
          .lf-title {
            font-size: 34px;
          }

          .lf-img-container {
            height: 270px;
          }
        }

        /* STANDARD DESKTOP */
        @media (min-width: 1280px) and (max-width: 1439px) {
          .lf-grid {
            gap: 22px;
          }

          .lf-img-container {
            height: 250px;
          }
        }

        /* SMALL DESKTOP / LARGE TABLET */
        @media (max-width: 1279px) and (min-width: 1025px) {
          .lf-container {
            --container-padding: 40px;
          }

          .lf-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .lf-img-container {
            height: 240px;
          }
        }

        /* TABLET */
        @media (max-width: 1024px) and (min-width: 769px) {
          .lf-container {
            --container-padding: 32px;
          }

          .lf-section {
            padding: 48px 0;
          }

          .lf-header {
            margin-bottom: 40px;
          }

          .lf-title {
            font-size: 28px;
          }

          .lf-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .lf-img-container {
            height: 220px;
          }

          .lf-content {
            padding: 16px;
          }

          .lf-title-card {
            font-size: 15px;
          }

          .lf-description {
            font-size: 12px;
          }
        }

        /* MOBILE - 2 COLUMNS */
        @media (max-width: 768px) {
          .lf-container {
            --container-padding: 16px;
          }

          .lf-section {
            padding: 40px 0;
          }

          .lf-header {
            margin-bottom: 32px;
          }

          .lf-title {
            font-size: 24px;
          }

          .lf-subtitle {
            font-size: 14px;
          }

          .lf-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .lf-img-container {
            height: 180px;
          }

          .lf-content {
            padding: 14px;
            gap: 8px;
          }

          .lf-title-card {
            font-size: 14px;
          }

          .lf-description {
            font-size: 12px;
          }

          .lf-footer {
            gap: 8px;
          }

          .lf-btn {
            padding: 9px 14px;
            font-size: 12px;
            gap: 5px;
          }

          .lf-btn svg {
            width: 14px;
            height: 14px;
          }

          .wishlist-btn {
            opacity: 1;
            width: 34px;
            height: 34px;
            top: 10px;
            left: 10px;
          }

          .wishlist-btn svg {
            width: 16px;
            height: 16px;
          }

          .lf-tag {
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            font-size: 10px;
          }
        }

        /* SMALL MOBILE */
        @media (max-width: 480px) {
          .lf-section {
            padding: 36px 0;
          }

          .lf-header {
            margin-bottom: 28px;
          }

          .lf-title {
            font-size: 22px;
          }

          .lf-grid {
            gap: 14px;
          }

          .lf-img-container {
            height: 170px;
          }

          .lf-content {
            padding: 12px;
          }

          .lf-title-card {
            font-size: 13px;
          }

          .lf-description {
            font-size: 11px;
          }
        }

        /* EXTRA SMALL MOBILE */
        @media (max-width: 375px) {
          .lf-container {
            --container-padding: 12px;
          }

          .lf-section {
            padding: 32px 0;
          }

          .lf-title {
            font-size: 20px;
          }

          .lf-subtitle {
            font-size: 13px;
          }

          .lf-grid {
            gap: 12px;
          }

          .lf-img-container {
            height: 160px;
          }

          .lf-content {
            padding: 10px;
            gap: 6px;
          }

          .lf-btn {
            padding: 8px 12px;
            font-size: 11px;
          }
        }

        /* TINY MOBILE */
        @media (max-width: 320px) {
          .lf-title {
            font-size: 18px;
          }

          .lf-grid {
            gap: 10px;
          }

          .lf-img-container {
            height: 140px;
          }

          .lf-title-card {
            font-size: 12px;
          }

          .lf-description {
            font-size: 10px;
          }
        }

        /* ACCESSIBILITY */
        .lf-btn:focus,
        .wishlist-btn:focus {
          outline: 2px solid var(--primary-pink);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}),r.jsx("section",{className:"lf-section",children:r.jsxs("div",{className:"lf-container",children:[r.jsxs("div",{className:"lf-header",children:[r.jsx("h2",{className:"lf-title",children:"Large Format & Outdoor Printing"}),r.jsx("p",{className:"lf-subtitle",children:"Professional large-scale printing for impactful displays"})]}),r.jsx("div",{className:"lf-grid",children:s0.map((x,O)=>r.jsxs("div",{className:"lf-card",children:[r.jsxs("div",{className:"lf-img-container",children:[r.jsx("img",{src:x.img,className:"lf-img",alt:x.title,loading:O<4?"eager":"lazy"}),r.jsx("button",{className:"wishlist-btn","aria-label":"Add to wishlist",children:r.jsx(qh,{})}),x.tag&&r.jsx("div",{className:"lf-tag",children:x.tag})]}),r.jsxs("div",{className:"lf-content",children:[r.jsx("h3",{className:"lf-title-card",children:x.title}),r.jsx("p",{className:"lf-description",children:x.description}),r.jsx("div",{className:"lf-footer",children:r.jsxs("button",{className:"lf-btn",children:[r.jsx(Gi,{}),r.jsx("span",{children:"Get Quote"})]})})]})]},O))})]})})]});function p0(){return r.jsxs(r.Fragment,{children:[r.jsx(t0,{}),r.jsx(e0,{}),r.jsx(n0,{}),r.jsx(u0,{}),r.jsx(r0,{}),r.jsx(o0,{}),r.jsx(d0,{}),r.jsx(a0,{})]})}hh.createRoot(document.getElementById("root")).render(r.jsx(ch.StrictMode,{children:r.jsx(p0,{})}));
