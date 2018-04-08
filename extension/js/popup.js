/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/popup.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/class/Chrome.ts":
/*!********************************!*\
  !*** ./src/js/class/Chrome.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar Chrome = /** @class */ (function () {\n    function Chrome() {\n    }\n    Chrome.prototype.background = function () {\n        this.listener();\n        this.rule();\n    };\n    Chrome.prototype.request = function (type, callback) {\n        chrome.runtime.sendMessage({\n            type: type\n        }, function (response) {\n            if (typeof callback === 'function') {\n                callback(response);\n            }\n        });\n    };\n    Chrome.prototype.listener = function () {\n        var _this = this;\n        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {\n            if (typeof _this[request.type] === 'function') {\n                _this[request.type](sendResponse);\n            }\n            return true;\n        });\n    };\n    Chrome.prototype.authorize = function (sendResponse) {\n        chrome.identity.getAuthToken({\n            interactive: false\n        }, function (token) {\n            token ? sendResponse({ token: token }) : sendResponse('failed');\n        });\n    };\n    Chrome.prototype.userinfo = function (sendResponse) {\n        chrome.identity.getProfileUserInfo(function (userInfo) {\n            sendResponse(userInfo);\n        });\n    };\n    Chrome.prototype.rule = function () {\n        chrome.runtime.onInstalled.addListener(this.removeRule);\n    };\n    Chrome.prototype.removeRule = function () {\n        chrome.declarativeContent.onPageChanged.removeRules(undefined, this.addRule);\n    };\n    Chrome.prototype.addRule = function () {\n        chrome.declarativeContent.onPageChanged.addRules([{\n                conditions: [\n                    new chrome.declarativeContent.PageStateMatcher({\n                        pageUrl: {\n                            hostEquals: 'twitter.com',\n                            schemes: ['https']\n                        }\n                    })\n                ],\n                actions: [new chrome.declarativeContent.ShowPageAction()]\n            }]);\n    };\n    return Chrome;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Chrome);\n\n\n//# sourceURL=webpack:///./src/js/class/Chrome.ts?");

/***/ }),

/***/ "./src/js/class/Popup.ts":
/*!*******************************!*\
  !*** ./src/js/class/Popup.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Chrome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Chrome */ \"./src/js/class/Chrome.ts\");\n\nvar Popup = /** @class */ (function () {\n    function Popup() {\n        this.chrome = new _Chrome__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        this.element = document.querySelector('main');\n        this.init();\n    }\n    Popup.prototype.init = function () {\n        var _this = this;\n        this.chrome.request('userinfo', function (response) {\n            _this.validateLogin(response);\n        });\n    };\n    Popup.prototype.validateLogin = function (userinfo) {\n        if (userinfo.id) {\n            this.display('Logged in successfully.');\n        }\n        else {\n            this.display('Not logged in. Please log in Chrome.');\n        }\n    };\n    Popup.prototype.display = function (text) {\n        this.element.innerHTML = text;\n    };\n    return Popup;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Popup);\n\n\n//# sourceURL=webpack:///./src/js/class/Popup.ts?");

/***/ }),

/***/ "./src/js/popup.ts":
/*!*************************!*\
  !*** ./src/js/popup.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _class_Popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class/Popup */ \"./src/js/class/Popup.ts\");\n\nvar popup = new _class_Popup__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack:///./src/js/popup.ts?");

/***/ })

/******/ });