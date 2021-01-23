/**
 * id5-api.js - The ID5 API is designed to make accessing the ID5 Universal ID simple for publishers and their ad tech vendors. The ID5 Universal ID is a shared, neutral identifier that publishers and ad tech platforms can use to recognise users even in environments where 3rd party cookies are not available. For more information, visit https://id5.io/universal-id.
 * @version v0.9.7-pre
 * @link https://id5.io/
 * @license Apache-2.0
 */
!function(n){var o={};function r(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.m=n,r.c=o,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"bind",function(){return S}),t.replaceTokenInString=function(r,e,a){return P(e,function(e,t){e=void 0===e?"":e;var n=a+t.toUpperCase()+a,o=new RegExp(n,"g");r=r.replace(o,e)}),r},t.logMessage=I,t.logInfo=function(){w()&&y&&console.info.apply(console,k(arguments,"INFO:"))},t.logWarn=function(){w()&&m&&console.warn.apply(console,k(arguments,"WARNING:"))},t.logError=D,t.getParameterByName=function(e){var t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(window.location.search);return null!==t?decodeURIComponent(t[1].replace(/\+/g," ")):""},t.isA=O,t.isFn=A,t.isStr=_,t.isArray=E,t.isNumber=function(e){return O(e,d)},t.isPlainObject=function(e){return O(e,p)},t.isBoolean=function(e){return O(e,f)},t.isEmpty=T,t._each=P,t._map=function(n,o){if(T(n))return[];if(A(n.map))return n.map(o);var r=[];return P(n,function(e,t){r.push(o(e,t,n))}),r},t.isSafariBrowser=function(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)},t.checkCookieSupport=function(){if(window.navigator.cookieEnabled||document.cookie.length)return!0},t.cookiesAreEnabled=function(){return window.document.cookie="id5.cookieTest",-1!==window.document.cookie.indexOf("id5.cookieTest")},t.getCookie=function(e){var t=window.document.cookie.match("(^|;)\\s*"+e+"\\s*=\\s*([^;]*)\\s*(;|$)");return t?decodeURIComponent(t[2]):null},t.setCookie=function(e,t,n){document.cookie="".concat(e,"=").concat(encodeURIComponent(t)).concat(""!==n?"; expires=".concat(n):"","; path=/")},t.getItemFromLocalStorage=R,t.getFromLocalStorage=function(e){var t=window.localStorage.getItem("".concat(e.name,"_exp"));return t&&0<new Date(t).getTime()-Date.now()?R(e.name):(j(e),null)},t.setItemInLocalStorage=F,t.setInLocalStorage=function(e,t){var n=new Date(Date.now()+864e5*e.expiresDays).toUTCString();F("".concat(e.name,"_exp"),n),F("".concat(e.name),t)},t.removeItemFromLocalStorage=x,t.removeFromLocalStorage=j,t.parseQS=L,t.formatQS=G,t.parse=M,t.format=U,t.ajax=function(e,t,n){var o,r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:{};try{var a=r.method||(n?"POST":"GET");document.createElement("a").href=e;var i,s="object"===l(t)&&null!==t?t:{success:function(){I("xhr success")},error:function(e){D("xhr error",null,e)}};"function"==typeof t&&(s.success=t),(o=new window.XMLHttpRequest).onreadystatechange=function(){var e;o.readyState===V&&(200<=(e=o.status)&&e<300||304===e?s.success(o.responseText,o):s.error(o.statusText,o))},o.ontimeout=function(){D("  xhr timeout after ",o.timeout,"ms")},"GET"===a&&n&&(c((i=M(e,r)).search,n),e=U(i)),o.open(a,e,!0),r.withCredentials&&(o.withCredentials=!0),P(r.customHeaders,function(e,t){o.setRequestHeader(t,e)}),r.preflight&&o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.setRequestHeader("Content-Type",r.contentType||"text/plain"),"POST"===a&&n?o.send(n):o.send()}catch(e){D("xhr construction",e)}},t.fireAsyncPixel=B,t.deferPixelFire=function(e,t,n){"loading"!==document.readyState?B(e,t,n):document.addEventListener("DOMContentLoaded",function(){B(e,t,n)})},t.cyrb53Hash=function(e){for(var t,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,o=function(e,t){if(A(Math.imul))return Math.imul(e,t);var n=(4194303&e)*(t|=0);return 4290772992&e&&(n+=(4290772992&e)*t|0),0|n},r=3735928559^n,a=1103547991^n,i=0;i<e.length;i++)t=e.charCodeAt(i),r=o(r^t,2654435761),a=o(a^t,1597334677);return r=o(r^r>>>16,2246822507)^o(a^a>>>13,3266489909),(4294967296*(2097151&(a=o(a^a>>>16,2246822507)^o(r^r>>>13,3266489909)))+(r>>>0)).toString()};var o=n(1);function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],o=!0,r=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(o=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);o=!0);}catch(e){r=!0,a=e}finally{try{o||null==s.return||s.return()}finally{if(r)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}var i="Array",s="String",u="Function",d="Number",p="Object",f="Boolean",h=Object.prototype.toString,g=Boolean(window.console),v=Boolean(g&&window.console.log),y=Boolean(g&&window.console.info),m=Boolean(g&&window.console.warn),b=Boolean(g&&window.console.error),C={},S=function(e,t){return t}.bind(null,1,C)()===C?Function.prototype.bind:function(e){var t=this,n=Array.prototype.slice.call(arguments,1);return function(){return t.apply(e,n.concat(Array.prototype.slice.call(arguments)))}};function I(){w()&&v&&console.log.apply(console,k(arguments,"MESSAGE:"))}function D(){w()&&b&&console.error.apply(console,k(arguments,"ERROR:"))}function k(e,t){return e=[].slice.call(e),t&&e.unshift(t),e.unshift("display: inline-block; color: #fff; background: #1c307e; padding: 1px 4px; border-radius: 3px;"),e.unshift("%cID5"),e}function w(){return o.default&&!0===o.default.debug}function O(e,t){return h.call(e)==="[object "+t+"]"}function A(e){return O(e,u)}function _(e){return O(e,s)}function E(e){return O(e,i)}function T(e){if(!e)return!0;if(E(e)||_(e))return!(0<e.length);for(var t in e)if(hasOwnProperty.call(e,t))return!1;return!0}function P(e,t){if(!T(e)){if(A(e.forEach))return e.forEach(t,this);var n=0,o=e.length;if(0<o)for(;n<o;n++)t(e[n],n,e);else for(n in e)hasOwnProperty.call(e,n)&&t.call(this,e[n],n)}}function N(){try{return window.localStorage}catch(e){D("Local storage api disabled!")}}function R(e){if(N())return window.localStorage.getItem(e)}function F(e,t){N()&&window.localStorage.setItem(e,t)}function x(e){N()&&window.localStorage.removeItem(e)}function j(e){x("".concat(e.name)),x("".concat(e.name,"_exp"))}function L(e){return e?e.replace(/^\?/,"").split("&").reduce(function(e,t){var n=a(t.split("="),2),o=n[0],r=n[1];return/\[\]$/.test(o)?(e[o=o.replace("[]","")]=e[o]||[],e[o].push(r)):e[o]=r||"",e},{}):{}}function G(e){return Object.keys(e).map(function(t){return Array.isArray(e[t])?e[t].map(function(e){return"".concat(t,"[]=").concat(e)}).join("&"):"".concat(t,"=").concat(e[t])}).join("&")}function M(e,t){var n=document.createElement("a");t&&"noDecodeWholeURL"in t&&t.noDecodeWholeURL?n.href=e:n.href=decodeURIComponent(e);var o=t&&"decodeSearchAsString"in t&&t.decodeSearchAsString;return{href:n.href,protocol:(n.protocol||"").replace(/:$/,""),hostname:n.hostname,port:+n.port,pathname:n.pathname.replace(/^(?!\/)/,"/"),search:o?n.search:L(n.search||""),hash:(n.hash||"").replace(/^#/,""),host:n.host||window.location.host}}function U(e){return(e.protocol||"http")+"://"+(e.host||e.hostname+(e.port?":".concat(e.port):""))+(e.pathname||"")+(e.search?"?".concat(G(e.search||"")):"")+(e.hash?"#".concat(e.hash):"")}var V=4;function B(e,t,n){var o=new Image;o.src=e,A(t)&&t(),A(n)&&(o.complete?n():o.addEventListener("load",n))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"Id5Api",function(){return o}),n.d(t,"ID5",function(){return u});var v=n(0),r=n(3),a=n(4),i=n(5),s=n(6);function c(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),l(this,"loaded",!1),l(this,"debug",!1),l(this,"debugBypassConsent",!1),l(this,"allowLocalStorageWithoutConsentApi",!1),l(this,"localStorageAllowed",!1),l(this,"referer",!1),l(this,"version",void 0),l(this,"versions",{}),this.loaded=!0,this.debug=this.debug||"TRUE"===v.getParameterByName("id5_debug").toUpperCase(),this.referer=Object(r.a)();var e=this;this.clientStore=new a.a(function(){return e.localStorageAllowed})}var e,n,o;return e=t,(n=[{key:"init",value:function(e){if(void 0===this.version)throw new Error('ID5.version variable is missing! Make sure you build from source with "gulp build" from this project. Contact support@id5.io for help.');try{v.logInfo("Invoking Id5Api.init",arguments);var t=new s.a(e);return this.debugBypassConsent=this.debugBypassConsent||t.getOptions().debugBypassConsent,this.allowLocalStorageWithoutConsentApi=this.allowLocalStorageWithoutConsentApi||t.getOptions().allowLocalStorageWithoutConsentApi,this.consent=new i.a,this.getId(t,!1),v.logInfo("ID5 initialized for partner ".concat(t.getOptions().partnerId," with referer ").concat(this.referer.referer," and options"),e),t}catch(e){v.logError("Exception caught from Id5Api.init",e)}}},{key:"refreshId",value:function(e,t,n){var o=1<arguments.length&&void 0!==t&&t,r=2<arguments.length&&void 0!==n?n:{};if(void 0===this.version)throw new Error('ID5.version variable is missing! Make sure you build from source with "gulp build" from this project. Contact support@id5.io for help.');if(!v.isBoolean(o))throw new Error("Invalid signature for Id5Api.refreshId: second parameter must be a boolean");try{v.logInfo("Invoking Id5Api.refreshId",arguments),e.cancelCallback(),e.updateOptions(r),this.consent.resetConsentData(),this.getId(e,o)}catch(e){v.logError("Exception caught from Id5Api.refreshId",e)}}},{key:"updateLocalStorageAllowed",value:function(){this.localStorageAllowed=this.consent.isLocalStorageAllowed(this.allowLocalStorageWithoutConsentApi,this.debugBypassConsent)}},{key:"getId",value:function(s,e){var c,t,l=this,u=1<arguments.length&&void 0!==e&&e,d=s.getOptions(),p=0,f=!1,h=!1,g=!1;this.updateLocalStorageAllowed(),this.localStorageAllowed&&(c=this.clientStore.getResponse(),t=this.clientStore.getDateTime(),f=t<=0||Date.now()-t>1e3*d.refreshInSeconds,p=this.clientStore.getNb(d.partnerId),h=!this.clientStore.storedPdMatchesPd(d.partnerId,d.pd)),c||(c=this.clientStore.getResponseFromLegacyCookie(),f=!0),s.scheduleWatchDog(),c&&c.universal_uid&&!h?(s.setUserId(c.universal_uid,c.link_type||0,!0),p=this.clientStore.incNb(d.partnerId,p),g=!0,v.logInfo("ID5 User ID available from cache:",{storedResponse:c,storedDateTime:t,refreshNeeded:f})):c&&c.universal_uid&&h?v.logInfo("PD value has changed, so ignoring User ID from cache"):c&&!c.universal_uid?v.logError("Invalid stored response: ",c):v.logInfo("No ID5 User ID available from cache"),this.consent.requestConsent(this.debugBypassConsent,d.cmpApi,d.consentData,function(e){var t,n,a,i,o,r;l.updateLocalStorageAllowed(),!1!==l.localStorageAllowed?(v.logInfo("Consent to access local storage is given: ",l.localStorageAllowed),c=l.clientStore.getResponse()||l.clientStore.getResponseFromLegacyCookie(),t=!l.clientStore.storedConsentDataMatchesConsentData(e),l.clientStore.putHashedConsentData(e),l.clientStore.putHashedPd(d.partnerId,d.pd),c&&c.universal_uid&&c.signature&&!f&&!t&&!h&&!u||(n="https://id5-sync.com/g/v2/".concat(d.partnerId,".json"),a=e&&e.gdprApplies?1:0,i=e&&e.gdprApplies?e.consentString:"",o=c&&c.signature?c.signature:"",r={partner:d.partnerId,v:l.version,o:"api",gdpr:a,gdpr_consent:i,rf:l.referer.referer,u:l.referer.stack[0]||window.location.href,top:l.referer.reachedTop?1:0,s:o,pd:d.pd,puid:d.partnerUserId,nbPage:p,id5cdn:document.currentScript&&document.currentScript.src&&0===document.currentScript.src.indexOf("https://cdn.id5-sync.com")},d.tpids&&v.isArray(d.tpids)&&0<d.tpids.length&&(r.tpids=d.tpids),v.logInfo("Fetching ID5 user ID from:",n,r),u&&v.logInfo("...with Force Fetch"),v.ajax(n,{success:function(e){if(v.logInfo("Response from ID5 received:",e),e)try{var t,n,o,r=JSON.parse(e);v.logInfo("Valid json response from ID5 received:",r),r.universal_uid?(s.setUserId(r.universal_uid,r.link_type||0,!1),l.consent.setStoredPrivacy(r.privacy),l.updateLocalStorageAllowed(),!0===l.localStorageAllowed||void 0===r.privacy?(l.clientStore.putResponse(e),l.clientStore.setDateTime(Date.now()),l.clientStore.setNb(d.partnerId,g?0:1)):l.clientStore.clearAll(d.partnerId),l.clientStore.removeLegacyCookies(d.partnerId),!0===r.cascade_needed&&!0===l.localStorageAllowed&&(t=d.partnerUserId&&0<d.partnerUserId.length,n="https://id5-sync.com/".concat(t?"s":"i","/").concat(d.partnerId,"/8.gif?id5id=").concat(s._userId,"&fs=").concat(l.clientStore.forceSync(),"&o=api&").concat(t?"puid="+d.partnerUserId+"&":"","gdpr_consent=").concat(i,"&gdpr=").concat(a),v.logInfo("Opportunities to cascade available:",n),o=l.clientStore,v.deferPixelFire(n,void 0,function(){o.syncCallback()}))):v.logError("Invalid response from ID5 servers:",e)}catch(e){v.logError(e)}else v.logError("Empty response from ID5 servers:",e)},error:function(e){v.logError(e)}},JSON.stringify(r),{method:"POST",withCredentials:!0}))):v.logInfo("No legal basis to use ID5",e)})}}])&&c(e.prototype,n),o&&c(e,o),t}();window.ID5||(window.ID5=new o);var u=window.ID5;t.default=u},function(e,t){e.exports={STORAGE_CONFIG:{ID5:{name:"id5id",expiresDays:90},LAST:{name:"id5id_last",expiresDays:90},CONSENT_DATA:{name:"id5id_cached_consent_data",expiresDays:30},PD:{name:"id5id_cached_pd",expiresDays:30},FS:{name:"id5id_fs",expiresDays:7},PRIVACY:{name:"id5id_privacy",expiresDays:30}},LEGACY_COOKIE_NAMES:["id5.1st","id5id.1st"],PRIVACY:{JURISDICTIONS:{gdpr:!0,ccpa:!1,lgpd:!0,other:!1}}}},function(e,t,n){"use strict";function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}n.d(t,"a",function(){return o});var a,o=(a=window,function(){try{var e,t=i(),n=t.length-1,o=null!==t[n].location||0<n&&null!==t[n-1].referrer,r=function(e){for(var t,n=[],o=null,r=null,a=null,i=null,s=null,c=e.length-1;0<=c;c--){try{r=e[c].location}catch(e){}if(r)n.push(r),s=s||r;else if(0!==c){t=e[c-1];try{a=t.referrer,i=t.ancestor}catch(e){}a?(n.push(a),s=s||a):i?(n.push(i),s=s||i):n.push(o)}else n.push(o)}return{stack:n,detectedRefererUrl:s}}(t);return t[t.length-1].canonicalUrl&&(e=t[t.length-1].canonicalUrl),{referer:r.detectedRefererUrl,reachedTop:o,numIframes:n,stack:r.stack,canonicalUrl:e}}catch(e){}});function i(){var e=function(){var t,n=[];do{try{t=t?t.parent:a;try{var e=t===a.top,o={referrer:t.document.referrer||null,location:t.location.href||null,isTop:e};e&&(o=r(o,{canonicalUrl:function(e){try{var t=e.querySelector("link[rel='canonical']");if(null!==t)return t.href}catch(e){}return null}(t.document)})),n.push(o)}catch(e){n.push({referrer:null,location:null,isTop:t===a.top})}}catch(e){return n.push({referrer:null,location:null,isTop:!1}),n}}while(t!==a.top);return n}(),t=function(){try{if(!a.location.ancestorOrigins)return;return a.location.ancestorOrigins}catch(e){}}();if(t)for(var n=0,o=t.length;n<o;n++)e[n].ancestor=t[n];return e}},function(e,t,n){"use strict";n.d(t,"a",function(){return s});var o=n(0),r=n(2),a=n.n(r);function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var s=function(){function r(e){var t,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),o=void 0,(n="localStorageAllowedCallback")in(t=this)?Object.defineProperty(t,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[n]=o,this.localStorageAllowedCallback=e}var e,t,n;return e=r,n=[{key:"pdCacheConfig",value:function(e){return{name:"".concat(a.a.STORAGE_CONFIG.PD.name,"_").concat(e),expiresDays:a.a.STORAGE_CONFIG.PD.expiresDays}}},{key:"makeStoredHash",value:function(e){return o.cyrb53Hash("string"==typeof e?e:"")}},{key:"nbCacheConfig",value:function(e){return{name:"".concat(a.a.STORAGE_CONFIG.ID5.name,"_").concat(e,"_nb"),expiresDays:a.a.STORAGE_CONFIG.ID5.expiresDays}}},{key:"storedDataMatchesCurrentData",value:function(e,t){return null==e||e===t}},{key:"makeStoredConsentDataHash",value:function(e){var t={consentString:"",gdprApplies:!1,apiVersion:0};return e&&(t.consentString=e.consentString,t.gdprApplies=e.gdprApplies,t.apiVersion=e.apiVersion),o.cyrb53Hash(JSON.stringify(t))}}],(t=[{key:"get",value:function(e){try{if(!0===this.localStorageAllowedCallback())return o.getFromLocalStorage(e);o.logError("clientStore.get() has been called without localStorageAllowed")}catch(e){o.logError(e)}}},{key:"clear",value:function(e){try{o.removeFromLocalStorage(e)}catch(e){o.logError(e)}}},{key:"put",value:function(e,t){try{!0===this.localStorageAllowedCallback()?o.setInLocalStorage(e,t):o.logError("clientStore.put() has been called without localStorageAllowed")}catch(e){o.logError(e)}}},{key:"getResponseFromLegacyCookie",value:function(){var t;return a.a.LEGACY_COOKIE_NAMES.forEach(function(e){o.getCookie(e)&&(t=o.getCookie(e))}),t?JSON.parse(t):null}},{key:"getResponse",value:function(){var e=this.get(a.a.STORAGE_CONFIG.ID5);return e?JSON.parse(e):e}},{key:"clearResponse",value:function(){this.clear(a.a.STORAGE_CONFIG.ID5)}},{key:"putResponse",value:function(e){this.put(a.a.STORAGE_CONFIG.ID5,e)}},{key:"getHashedConsentData",value:function(){return this.get(a.a.STORAGE_CONFIG.CONSENT_DATA)}},{key:"clearHashedConsentData",value:function(){this.clear(a.a.STORAGE_CONFIG.CONSENT_DATA)}},{key:"putHashedConsentData",value:function(e){this.put(a.a.STORAGE_CONFIG.CONSENT_DATA,r.makeStoredConsentDataHash(e))}},{key:"getHashedPd",value:function(e){return this.get(r.pdCacheConfig(e))}},{key:"storedPdMatchesPd",value:function(e,t){return r.storedDataMatchesCurrentData(this.getHashedPd(e),r.makeStoredHash(t))}},{key:"clearHashedPd",value:function(e){this.clear(r.pdCacheConfig(e))}},{key:"putHashedPd",value:function(e,t){this.put(r.pdCacheConfig(e),r.makeStoredHash(t))}},{key:"getDateTime",value:function(){return new Date(+this.get(a.a.STORAGE_CONFIG.LAST)).getTime()}},{key:"clearDateTime",value:function(){this.clear(a.a.STORAGE_CONFIG.LAST)}},{key:"setDateTime",value:function(e){this.put(a.a.STORAGE_CONFIG.LAST,e)}},{key:"getNb",value:function(e){var t=this.get(r.nbCacheConfig(e));return t?parseInt(t):0}},{key:"clearNb",value:function(e){this.clear(r.nbCacheConfig(e))}},{key:"setNb",value:function(e,t){this.put(r.nbCacheConfig(e),t)}},{key:"incNb",value:function(e,t){return t++,this.setNb(e,t),t}},{key:"syncCallback",value:function(){this.put(a.a.STORAGE_CONFIG.FS,"1")}},{key:"forceSync",value:function(){var e=this.get(a.a.STORAGE_CONFIG.FS);return void 0===e||"1"===e?0:1}},{key:"clearAll",value:function(e){this.clearResponse(),this.clearDateTime(),this.clearNb(e),this.clearHashedPd(e),this.clearHashedConsentData()}},{key:"removeLegacyCookies",value:function(t){var n=new Date(Date.now()-1e3).toUTCString();a.a.LEGACY_COOKIE_NAMES.forEach(function(e){o.setCookie("".concat(e),"",n),o.setCookie("".concat(e,"_nb"),"",n),o.setCookie("".concat(e,"_").concat(t,"_nb"),"",n),o.setCookie("".concat(e,"_last"),"",n),o.setCookie("".concat(e,".cached_pd"),"",n),o.setCookie("".concat(e,".cached_consent_data"),"",n)})}},{key:"storedConsentDataMatchesConsentData",value:function(e){return r.storedDataMatchesCurrentData(this.getHashedConsentData(),r.makeStoredConsentDataHash(e))}}])&&i(e.prototype,t),n&&i(e,n),r}()},function(e,t,n){"use strict";n.d(t,"a",function(){return s});var d=n(0),o=n(2),r=n.n(o);function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(){function u(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),i(this,"consentData",void 0),i(this,"staticConsentData",void 0),i(this,"storedPrivacyData",void 0),i(this,"cmpVersion",0),i(this,"cmpCallMap",{iab:this.lookupIabConsent,static:this.lookupStaticConsentData})}var e,t,n;return e=u,n=[{key:"findCMP",value:function(){for(var e,t,n=0,o=window;!e;){try{if("function"==typeof o.__tcfapi||"function"==typeof o.__cmp){t="function"==typeof o.__tcfapi?(n=2,o.__tcfapi):(n=1,o.__cmp),e=o;break}}catch(e){}try{if(o.frames.__tcfapiLocator){n=2,e=o;break}}catch(e){}try{if(o.frames.__cmpLocator){n=1,e=o;break}}catch(e){}if(o===window.top)break;o=o.parent}return{cmpVersion:n,cmpFrame:e,cmpFunction:t}}},{key:"cmpSuccess",value:function(e,n,t){var o=1===e.cmpVersion?function(e){var t=e&&e.getConsentData&&e.getConsentData.gdprApplies;return!("boolean"==typeof t&&(!0!==t||d.isStr(e.getConsentData.consentData)&&d.isPlainObject(e.getVendorConsents)&&1<Object.keys(e.getVendorConsents).length))}:2===e.cmpVersion?function(){var e=n&&"boolean"==typeof n.gdprApplies?n.gdprApplies:void 0,t=n&&n.tcString;return!("boolean"==typeof e&&(!0!==e||d.isStr(t)))}:null;d.logInfo("CMP Success callback for version",e.cmpVersion,o),d.isFn(o)&&(o(n)?(e.resetConsentData(),d.logError("CMP returned unexpected value during lookup process.",n)):e.storeConsentData(n)),t(e.consentData)}}],(t=[{key:"lookupStaticConsentData",value:function(e,t){this.cmpVersion=this.staticConsentData.getConsentData?1:this.staticConsentData.getTCData?2:0,2===this.cmpVersion?e(this,this.staticConsentData.getTCData,t):e(this,this.staticConsentData,t)}},{key:"lookupIabConsent",value:function(n,o){var r=this;var t,e=(t={},{consentDataCallback:function(e){d.logInfo("cmpApi: consentDataCallback"),t.getConsentData=e,a()},vendorConsentsCallback:function(e){d.logInfo("cmpApi: vendorConsentsCallback"),t.getVendorConsents=e,a()}});function a(){t.getConsentData&&t.getVendorConsents&&n(r,t,o)}var i=u.findCMP(),s=i.cmpVersion,c=i.cmpFrame,l=i.cmpFunction;if(this.cmpVersion=s,!c)return d.logError("CMP not found"),void n(r,void 0,o);d.isFn(l)?(d.logInfo("cmpApi: calling getConsentData & getVendorConsents"),1===s?(l("getConsentData",null,e.consentDataCallback),l("getVendorConsents",null,e.vendorConsentsCallback)):2===s&&l("addEventListener",s,function(e,t){d.logInfo("Received a response from CMP",e),t?!1!==e.gdprApplies&&"tcloaded"!==e.eventStatus&&"useractioncomplete"!==e.eventStatus||n(r,e,o):(d.logError("CMP unable to register callback function.  Please check CMP setup."),n(r,void 0,o))})):n(r,void 0,o)}},{key:"requestConsent",value:function(e,t,n,o){e?(d.logError("ID5 is operating in forced consent mode and will not retrieve any consent signals from the CMP"),o(this.consentData)):this.cmpCallMap[t]?this.consentData?o(this.consentData):("static"===t&&(d.isPlainObject(n)?this.staticConsentData=n:d.logError("cmpApi: 'static' did not specify consentData.")),this.cmpCallMap[t].call(this,u.cmpSuccess,o)):(d.logError("Unknown consent API: ".concat(t)),this.resetConsentData(),o(this.consentData))}},{key:"resetConsentData",value:function(){this.consentData=void 0,this.storedPrivacyData=void 0}},{key:"storeConsentData",value:function(e){1===this.cmpVersion?this.consentData={consentString:e?e.getConsentData.consentData:void 0,vendorData:e?e.getVendorConsents:void 0,gdprApplies:e?e.getConsentData.gdprApplies:void 0,apiVersion:1}:2===this.cmpVersion?this.consentData={consentString:e?e.tcString:void 0,vendorData:e||void 0,gdprApplies:e&&"boolean"==typeof e.gdprApplies?e.gdprApplies:void 0,apiVersion:2}:this.consentData={apiVersion:0}}},{key:"isLocalStorageAllowed",value:function(e,t){return!0===e||!0===t?(d.logError("Local storage access granted by configuration override, consent will not be checked"),!0):this.consentData?"boolean"!=typeof this.consentData.gdprApplies||!this.consentData.gdprApplies||!(!this.consentData.consentString||0===this.consentData.apiVersion)&&((1!==this.consentData.apiVersion||!this.consentData.vendorData||!this.consentData.vendorData.purposeConsents||!1!==this.consentData.vendorData.purposeConsents[1])&&!(2===this.consentData.apiVersion&&this.consentData.vendorData&&this.consentData.vendorData.purpose&&this.consentData.vendorData.purpose.consents&&!1===this.consentData.vendorData.purpose.consents[1])):this.isProvisionalLocalStorageAllowed()}},{key:"isProvisionalLocalStorageAllowed",value:function(){return d.isPlainObject(this.storedPrivacyData)||(this.storedPrivacyData=JSON.parse(d.getFromLocalStorage(r.a.STORAGE_CONFIG.PRIVACY))),!(!this.storedPrivacyData||!0!==this.storedPrivacyData.id5_consent)||(this.storedPrivacyData&&void 0!==this.storedPrivacyData.jurisdiction?!1===(void 0!==r.a.PRIVACY.JURISDICTIONS[this.storedPrivacyData.jurisdiction]&&r.a.PRIVACY.JURISDICTIONS[this.storedPrivacyData.jurisdiction])||!0===this.storedPrivacyData.id5_consent:void 0)}},{key:"setStoredPrivacy",value:function(e){try{d.isPlainObject(e)?(this.storedPrivacyData=e,d.setInLocalStorage(r.a.STORAGE_CONFIG.PRIVACY,JSON.stringify(e))):d.logInfo("Cannot store privacy if it is not an object: ",e)}catch(e){d.logError(e)}}}])&&a(e.prototype,t),n&&a(e,n),u}()},function(e,t,n){"use strict";n.d(t,"a",function(){return o});var r=n(7),a=n(8),i=n(0);function s(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),c(this,"timerId",void 0),c(this,"_callbackFired",!1),c(this,"_isExposed",void 0),c(this,"_fromCache",void 0),c(this,"_userId",void 0),c(this,"_linkType",void 0),c(this,"config",void 0),this.config=new r.a(e)}var e,n,o;return e=t,o=[{key:"doFireCallBack",value:function(e){var t=e.getOptions().callbackOnAvailable;e.timerId=void 0,!e._callbackFired&&i.isFn(t)&&(i.logInfo("Calling callbackOnAvailable"),e._callbackFired=!0,t(e))}}],(n=[{key:"getOptions",value:function(){return this.config.getOptions()}},{key:"updateOptions",value:function(e){return this.config.updOptions(e)}},{key:"setUserId",value:function(e,t,n){var o,r=2<arguments.length&&void 0!==n&&n;e?(this._userId=e,this._linkType=t,this._fromCache=r,!0===(o=this.config.getOptions()).abTesting.enabled?this._isExposed=!a.a(e,o.abTesting.controlGroupPct):this._isExposed=!0,this._isExposed&&this.fireCallBack()):(this._userId=void 0,this._linkType=void 0,this._fromCache=void 0,this._isExposed=void 0)}},{key:"getUserId",value:function(){return!1===this._isExposed?"0":this._userId}},{key:"getLinkType",value:function(){return!1===this._isExposed?0:this._linkType}},{key:"isFromCache",value:function(){return this._fromCache}},{key:"exposeUserId",value:function(){return this._isExposed}},{key:"cancelCallback",value:function(){this.timerId&&(clearTimeout(this.timerId),this.timerId=void 0),this._callbackFired=!1}},{key:"scheduleWatchDog",value:function(){var e;!0===this._callbackFired?i.logInfo("scheduleWatchDog: Callback was already called, ignoring"):(this.timerId&&i.logError("scheduleWatchDog: Watchdog timer already in progress, canceling and rescheduling"),this.cancelCallback(),e=this,i.isFn(this.getOptions().callbackOnAvailable)&&0<=this.getOptions().callbackTimeoutInMs&&(this.timerId=setTimeout(function(){return t.doFireCallBack(e)},this.getOptions().callbackTimeoutInMs)))}},{key:"fireCallBack",value:function(){var e;!0===this._callbackFired?i.logInfo("fireCallBack: callbackOnAvailable was already called, ignoring"):(this.cancelCallback(),e=this,i.isFn(this.getOptions().callbackOnAvailable)&&(this.timerId=setTimeout(function(){return t.doFireCallBack(e)},0)))}}])&&s(e.prototype,n),o&&s(e,o),t}()},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",function(){return o});var s=n(0),o=function(){function o(e){if(!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),i(this,"options",void 0),i(this,"providedOptions",void 0),this.options={debugBypassConsent:!1,allowLocalStorageWithoutConsentApi:!1,cmpApi:"iab",consentData:{getConsentData:{consentData:void 0,gdprApplies:void 0},getVendorConsents:{}},refreshInSeconds:7200,partnerId:void 0,partnerUserId:void 0,callbackOnAvailable:void 0,callbackOnUpdates:void 0,callbackTimeoutInMs:void 0,pd:"",tpids:void 0,abTesting:{enabled:!1,controlGroupPct:0}},this.providedOptions={},!e.partnerId||"number"!=typeof e.partnerId)throw new Error("partnerId is required and must be a number");this.updOptions(e)}var e,t,n;return e=o,(t=[{key:"getOptions",value:function(){return this.options}},{key:"getProvidedOptions",value:function(){return this.providedOptions}},{key:"updOptions",value:function(t){var n=this;if("object"===r(t)){if("number"==typeof this.options.partnerId&&"number"==typeof t.partnerId&&t.partnerId!==this.options.partnerId)throw new Error("Cannot update config with a different partnerId");Object.keys(t).forEach(function(e){s.isA(t[e],o.configTypes[e])?(n.options[e]=t[e],n.providedOptions[e]=t[e]):s.logError("updOptions options ".concat(e," must be of type ").concat(o.configTypes[e]," but was ").concat(toString.call(t[e])))})}else s.logError("Config options must be an object")}}])&&a(e.prototype,t),n&&a(e,n),o}();i(o,"configTypes",{debugBypassConsent:"Boolean",allowLocalStorageWithoutConsentApi:"Boolean",cmpApi:"String",consentData:"Object",refreshInSeconds:"Number",partnerId:"Number",partnerUserId:"String",callbackOnAvailable:"Function",callbackOnUpdates:"Function",callbackTimeoutInMs:"Number",pd:"String",tpids:"Array",abTesting:"Object"})},function(e,t,n){"use strict";t.a=a;var o=n(0),r=1e4;function a(e,t){if(!Object(o.isNumber)(t)||t<0||1<t)throw new Error("A/B Testing controlGroupRatio must be a number >= 0 and <= 1");return((n=e)?(Object(o.cyrb53Hash)(n)%r+r)%r:Math.floor(Math.random()*r))<t*r;var n}}]),ID5.version="0.9.7-pre",ID5.versions[ID5.version]=!0;