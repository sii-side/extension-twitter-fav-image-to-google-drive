!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";var o=function(){function e(){}return e.prototype.background=function(){this.listener(),this.rule()},e.prototype.request=function(e,t){chrome.runtime.sendMessage({type:e},function(e){"function"==typeof t&&t(e)})},e.prototype.listener=function(){var e=this;chrome.runtime.onMessage.addListener(function(t,n,o){return"function"==typeof e[t.type]&&e[t.type](o),!0})},e.prototype.authorize=function(e){chrome.identity.getAuthToken({interactive:!1},function(t){e(t?{token:t}:"failed")})},e.prototype.userinfo=function(e){chrome.identity.getProfileUserInfo(function(t){e(t)})},e.prototype.rule=function(){chrome.runtime.onInstalled.addListener(this.removeRule)},e.prototype.removeRule=function(){chrome.declarativeContent.onPageChanged.removeRules(void 0,this.addRule)},e.prototype.addRule=function(){chrome.declarativeContent.onPageChanged.addRules([{conditions:[new chrome.declarativeContent.PageStateMatcher({pageUrl:{hostEquals:"twitter.com",schemes:["https"]}})],actions:[new chrome.declarativeContent.ShowPageAction]}])},e}();t.a=o},,,function(e,t,n){"use strict";n.r(t),(new(n(0).a)).background()}]);