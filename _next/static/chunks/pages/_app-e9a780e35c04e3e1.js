(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{5021:function(t,e,n){"use strict";n.d(e,{Up:function(){return T},Vv:function(){return R},ch:function(){return S}});var r,o,a,i,c,u,s=n(7294);(r=i||(i={})).INITIAL="initial",r.PENDING="pending",r.REJECTED="rejected",r.RESOLVED="resolved",(o=c||(c={})).LOADING_STATUS="setLoadingStatus",o.RESET_OPTIONS="resetOptions",o.SET_BRAINTREE_INSTANCE="braintreeInstance",(a=u||(u={})).NUMBER="number",a.CVV="cvv",a.EXPIRATION_DATE="expirationDate",a.EXPIRATION_MONTH="expirationMonth",a.EXPIRATION_YEAR="expirationYear",a.POSTAL_CODE="postalCode";var l="data-react-paypal-script-id",d={DATA_CLIENT_TOKEN:"data-client-token",DATA_USER_ID_TOKEN:"data-user-id-token",DATA_SDK_INTEGRATION_SOURCE:"data-sdk-integration-source",DATA_SDK_INTEGRATION_SOURCE_VALUE:"react-paypal-js",DATA_NAMESPACE:"data-namespace"},f="paypal",p=function(){return(p=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function h(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&0>e.indexOf(r)&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(t);o<r.length;o++)0>e.indexOf(r[o])&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]]);return n}function E(t,e,n){if(n||2==arguments.length)for(var r,o=0,a=e.length;o<a;o++)!r&&o in e||(r||(r=Array.prototype.slice.call(e,0,o)),r[o]=e[o]);return t.concat(r||Array.prototype.slice.call(e))}function v(t){return void 0===t&&(t=f),window[t]}function m(t){var e=t.reactComponentName,n=t.sdkComponentKey,r=t.sdkRequestedComponents,o=void 0===r?"":r,a=t.sdkDataNamespace,i=n.charAt(0).toUpperCase().concat(n.substring(1)),c="Unable to render <".concat(e," /> because window.").concat(void 0===a?f:a,".").concat(i," is undefined.");if(!o.includes(n)){var u=[o,n].filter(Boolean).join();c+="\nTo fix the issue, add '".concat(n,"' to the list of components passed to the parent PayPalScriptProvider:")+"\n`<PayPalScriptProvider options={{ components: '".concat(u,"'}}>`.")}return c}function A(t){return"react-paypal-js-".concat(function(t){for(var e="",n=0;n<t.length;n++){var r=t[n].charCodeAt(0)*n;t[n+1]&&(r+=t[n+1].charCodeAt(0)*(n-1)),e+=String.fromCharCode(97+Math.abs(r)%26)}return e}(JSON.stringify(t)))}function y(t,e){var n,r,o;switch(e.type){case c.LOADING_STATUS:return p(p({},t),{loadingStatus:e.value});case c.RESET_OPTIONS:return r=t.options[l],(null==(o=self.document.querySelector("script[".concat(l,'="').concat(r,'"]')))?void 0:o.parentNode)&&o.parentNode.removeChild(o),delete e.value[l],p(p({},t),{loadingStatus:i.PENDING,options:p(p({},e.value),((n={})[l]="".concat(A(e.value)),n[d.DATA_SDK_INTEGRATION_SOURCE]=d.DATA_SDK_INTEGRATION_SOURCE_VALUE,n))});case c.SET_BRAINTREE_INSTANCE:return p(p({},t),{braintreePayPalCheckoutInstance:e.value});default:return t}}var N=(0,s.createContext)(null);function T(){var t=function(t){if("function"==typeof(null==t?void 0:t.dispatch)&&0!==t.dispatch.length)return t;throw Error("usePayPalScriptReducer must be used within a PayPalScriptProvider")}((0,s.useContext)(N));return[p(p({},t),{isInitial:t.loadingStatus===i.INITIAL,isPending:t.loadingStatus===i.PENDING,isResolved:t.loadingStatus===i.RESOLVED,isRejected:t.loadingStatus===i.REJECTED}),t.dispatch]}(0,s.createContext)({});var S=function(t){var e=t.className,n=t.disabled,r=void 0!==n&&n,o=t.children,a=t.forceReRender,i=h(t,["className","disabled","children","forceReRender"]),c="".concat(void 0===e?"":e," ").concat(r?"paypal-buttons-disabled":"").trim(),u=(0,s.useRef)(null),l=(0,s.useRef)(null),f=T()[0],A=f.isResolved,y=f.options,N=(0,s.useState)(null),g=N[0],P=N[1],b=(0,s.useState)(!0),_=b[0],I=b[1],R=(0,s.useState)(null)[1];function O(){null!==l.current&&l.current.close().catch(function(){})}return(0,s.useEffect)(function(){if(!1===A)return O;var t=v(y[d.DATA_NAMESPACE]);if(void 0===t||void 0===t.Buttons)return R(function(){throw Error(m({reactComponentName:S.displayName,sdkComponentKey:"buttons",sdkRequestedComponents:y.components,sdkDataNamespace:y[d.DATA_NAMESPACE]}))}),O;try{l.current=t.Buttons(p(p({},i),{onInit:function(t,e){P(e),"function"==typeof i.onInit&&i.onInit(t,e)}}))}catch(t){return R(function(){throw Error("Failed to render <PayPalButtons /> component. Failed to initialize:  ".concat(t))})}return!1===l.current.isEligible()?(I(!1),O):(u.current&&l.current.render(u.current).catch(function(t){null!==u.current&&0!==u.current.children.length&&R(function(){throw Error("Failed to render <PayPalButtons /> component. ".concat(t))})}),O)},E(E([A],void 0===a?[]:a,!0),[i.fundingSource],!1)),(0,s.useEffect)(function(){null!==g&&(!0===r?g.disable().catch(function(){}):g.enable().catch(function(){}))},[r,g]),s.createElement(s.Fragment,null,_?s.createElement("div",{ref:u,style:r?{opacity:.38}:{},className:c}):o)};function g(t,e){void 0===e&&(e={});var n=document.createElement("script");return n.src=t,Object.keys(e).forEach(function(t){n.setAttribute(t,e[t]),"data-csp-nonce"===t&&n.setAttribute("nonce",e["data-csp-nonce"])}),n}function P(){if("undefined"==typeof Promise)throw Error("Promise is undefined. To resolve the issue, use a Promise polyfill.");return Promise}function b(t,e){if("object"!=typeof t||null===t)throw Error("Expected an options object.");if(void 0!==e&&"function"!=typeof e)throw Error("Expected PromisePonyfill to be a function.")}S.displayName="PayPalButtons";var _=function(t){var e=t.className,n=t.children,r=h(t,["className","children"]),o=T()[0],a=o.isResolved,i=o.options,c=(0,s.useRef)(null),u=(0,s.useState)(!0),l=u[0],f=u[1],E=(0,s.useState)(null)[1],A=function(t){var e=c.current;if(!e||!t.isEligible())return f(!1);e.firstChild&&e.removeChild(e.firstChild),t.render(e).catch(function(t){null!==e&&0!==e.children.length&&E(function(){throw Error("Failed to render <PayPalMarks /> component. ".concat(t))})})};return(0,s.useEffect)(function(){if(!1!==a){var t=v(i[d.DATA_NAMESPACE]);if(void 0===t||void 0===t.Marks)return E(function(){throw Error(m({reactComponentName:_.displayName,sdkComponentKey:"marks",sdkRequestedComponents:i.components,sdkDataNamespace:i[d.DATA_NAMESPACE]}))});A(t.Marks(p({},r)))}},[a,r.fundingSource]),s.createElement(s.Fragment,null,l?s.createElement("div",{ref:c,className:void 0===e?"":e}):n)};_.displayName="PayPalMarks";var I=function(t){var e=t.className,n=t.forceReRender,r=h(t,["className","forceReRender"]),o=T()[0],a=o.isResolved,i=o.options,c=(0,s.useRef)(null),u=(0,s.useRef)(null),l=(0,s.useState)(null)[1];return(0,s.useEffect)(function(){if(!1!==a){var t=v(i[d.DATA_NAMESPACE]);if(void 0===t||void 0===t.Messages)return l(function(){throw Error(m({reactComponentName:I.displayName,sdkComponentKey:"messages",sdkRequestedComponents:i.components,sdkDataNamespace:i[d.DATA_NAMESPACE]}))});u.current=t.Messages(p({},r)),u.current.render(c.current).catch(function(t){null!==c.current&&0!==c.current.children.length&&l(function(){throw Error("Failed to render <PayPalMessages /> component. ".concat(t))})})}},E([a],void 0===n?[]:n,!0)),s.createElement("div",{ref:c,className:void 0===e?"":e})};I.displayName="PayPalMessages";var R=function(t){var e,n=t.options,r=void 0===n?{"client-id":"test"}:n,o=t.children,a=t.deferLoading,u=void 0!==a&&a,f=(0,s.useReducer)(y,{options:p(p({},r),((e={})[l]="".concat(A(r)),e[d.DATA_SDK_INTEGRATION_SOURCE]=d.DATA_SDK_INTEGRATION_SOURCE_VALUE,e)),loadingStatus:u?i.INITIAL:i.PENDING}),h=f[0],E=f[1];return(0,s.useEffect)(function(){if(!1===u&&h.loadingStatus===i.INITIAL)return E({type:c.LOADING_STATUS,value:i.PENDING});if(h.loadingStatus===i.PENDING){var t=!0;return(function(t,e){if(void 0===e&&(e=P()),b(t,e),"undefined"==typeof window)return e.resolve(null);var n,r,o,a,i,c,u,s,l,d,f,p=(s="https://www.paypal.com/sdk/js",(u=t).sdkBaseURL&&(s=u.sdkBaseURL,delete u.sdkBaseURL),r=(n=u)["merchant-id"],o=n["data-merchant-id"],a="",i="",Array.isArray(r)?r.length>1?(a="*",i=r.toString()):a=r.toString():"string"==typeof r&&r.length>0?a=r:"string"==typeof o&&o.length>0&&(a="*",i=o),n["merchant-id"]=a,n["data-merchant-id"]=i,d=(l=Object.keys(u).filter(function(t){return void 0!==u[t]&&null!==u[t]&&""!==u[t]}).reduce(function(t,e){var n=u[e].toString();return"data-"===e.substring(0,5)?t.dataAttributes[e]=n:t.queryParams[e]=n,t},{queryParams:{},dataAttributes:{}})).queryParams,f=l.dataAttributes,{url:"".concat(s,"?").concat((c="",Object.keys(d).forEach(function(t){0!==c.length&&(c+="&"),c+=t+"="+d[t]}),c)),dataAttributes:f}),h=p.url,E=p.dataAttributes,v=E["data-namespace"]||"paypal",m=window[v];return function(t,e){var n=document.querySelector('script[src="'.concat(t,'"]'));if(null===n)return null;var r=g(t,e),o=n.cloneNode();if(delete o.dataset.uidAuto,Object.keys(o.dataset).length!==Object.keys(r.dataset).length)return null;var a=!0;return Object.keys(o.dataset).forEach(function(t){o.dataset[t]!==r.dataset[t]&&(a=!1)}),a?n:null}(h,E)&&m?e.resolve(m):(function(t,e){void 0===e&&(e=P()),b(t,e);var n=t.url,r=t.attributes;if("string"!=typeof n||0===n.length)throw Error("Invalid url.");if(void 0!==r&&"object"!=typeof r)throw Error("Expected attributes to be an object.");return new e(function(t,e){var o,a,i,c,u,s;if("undefined"==typeof window)return t();a=(o={url:n,attributes:r,onSuccess:function(){return t()},onError:function(){var t=Error('The script "'.concat(n,'" failed to load.'));return window.fetch?fetch(n).then(function(n){return 200===n.status&&e(t),n.text()}).then(function(t){var n;e(Error((n=t.split("/* Original Error:")[1])?n.replace(/\n/g,"").replace("*/","").trim():t))}).catch(function(t){e(t)}):e(t)}}).url,i=o.attributes,c=o.onSuccess,u=o.onError,(s=g(a,i)).onerror=u,s.onload=c,document.head.insertBefore(s,document.head.firstElementChild)})})({url:h,attributes:E},e).then(function(){var t=window[v];if(t)return t;throw Error("The window.".concat(v," global variable is not available."))})})(h.options).then(function(){t&&E({type:c.LOADING_STATUS,value:i.RESOLVED})}).catch(function(e){console.error("".concat("Failed to load the PayPal JS SDK script."," ").concat(e)),t&&E({type:c.LOADING_STATUS,value:i.REJECTED})}),function(){t=!1}}},[h.options,u,h.loadingStatus]),s.createElement(N.Provider,{value:p(p({},h),{dispatch:E})},o)}},3454:function(t,e,n){"use strict";var r,o;t.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(o=n.g.process)?void 0:o.env)?n.g.process:n(7663)},6840:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n(3847)}])},3847:function(t,e,n){"use strict";n.r(e);var r=n(5893);n(7475);var o=n(5021),a=n(3454);e.default=function(t){let{Component:e,pageProps:n}=t,i=a.env.PAYPAL_CLIENT_ID?a.env.PAYPAL_CLIENT_ID:"test";return(0,r.jsx)(o.Vv,{options:{"client-id":i,components:"buttons",currency:"GBP"},children:(0,r.jsx)(e,{...n})})}},7475:function(){},7663:function(t){!function(){var e={229:function(t){var e,n,r,o=t.exports={};function a(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}function c(t){if(e===setTimeout)return setTimeout(t,0);if((e===a||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(n){try{return e.call(null,t,0)}catch(n){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:a}catch(t){e=a}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(t){n=i}}();var u=[],s=!1,l=-1;function d(){s&&r&&(s=!1,r.length?u=r.concat(u):l=-1,u.length&&f())}function f(){if(!s){var t=c(d);s=!0;for(var e=u.length;e;){for(r=u,u=[];++l<e;)r&&r[l].run();l=-1,e=u.length}r=null,s=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function p(t,e){this.fun=t,this.array=e}function h(){}o.nextTick=function(t){var e=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new p(t,e)),1!==u.length||s||c(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=h,o.addListener=h,o.once=h,o.off=h,o.removeListener=h,o.removeAllListeners=h,o.emit=h,o.prependListener=h,o.prependOnceListener=h,o.listeners=function(t){return[]},o.binding=function(t){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},n={};function r(t){var o=n[t];if(void 0!==o)return o.exports;var a=n[t]={exports:{}},i=!0;try{e[t](a,a.exports,r),i=!1}finally{i&&delete n[t]}return a.exports}r.ab="//";var o=r(229);t.exports=o}()}},function(t){var e=function(e){return t(t.s=e)};t.O(0,[774,179],function(){return e(6840),e(880)}),_N_E=t.O()}]);