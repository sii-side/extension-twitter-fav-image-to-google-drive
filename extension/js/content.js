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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/content.ts");
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

/***/ "./src/js/class/ClickTarget.ts":
/*!*************************************!*\
  !*** ./src/js/class/ClickTarget.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Tweet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tweet */ \"./src/js/class/Tweet.ts\");\n\nvar ClickTarget = /** @class */ (function () {\n    function ClickTarget(element) {\n        this.element = element;\n        this.tweet();\n    }\n    ClickTarget.prototype.tweet = function () {\n        if (this.isFavorite()) {\n            new _Tweet__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.ancestor(['tweet']));\n        }\n    };\n    ClickTarget.prototype.isFavorite = function () {\n        return !!this.ancestor(['js-actionFavorite', 'ProfileTweet-actionButton']);\n    };\n    ClickTarget.prototype.ancestor = function (classes, element) {\n        if (element === void 0) { element = this.element; }\n        if (!element || !element.classList) {\n            return null;\n        }\n        if (classes.every(function (cls) { return element.classList.contains(cls); })) {\n            return element;\n        }\n        return this.ancestor(classes, element.parentElement);\n    };\n    return ClickTarget;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClickTarget);\n\n\n//# sourceURL=webpack:///./src/js/class/ClickTarget.ts?");

/***/ }),

/***/ "./src/js/class/GoogleDrive.ts":
/*!*************************************!*\
  !*** ./src/js/class/GoogleDrive.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Chrome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Chrome */ \"./src/js/class/Chrome.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = y[op[0] & 2 ? \"return\" : op[0] ? \"throw\" : \"next\"]) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [0, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\n\nvar GoogleDrive = /** @class */ (function () {\n    function GoogleDrive() {\n        this.FOLDER_NAME = 'T2GD';\n        this.BOUNDARY = 'hoge_fuga_piyo';\n        this.chrome = new _Chrome__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    }\n    GoogleDrive.prototype.save = function (imageData) {\n        return __awaiter(this, void 0, void 0, function () {\n            var list;\n            return __generator(this, function (_a) {\n                switch (_a.label) {\n                    case 0: return [4 /*yield*/, this.getToken()];\n                    case 1:\n                        _a.sent();\n                        return [4 /*yield*/, this.list()];\n                    case 2:\n                        list = _a.sent();\n                        this.upload(imageData, list);\n                        return [2 /*return*/];\n                }\n            });\n        });\n    };\n    GoogleDrive.prototype.getToken = function () {\n        return __awaiter(this, void 0, void 0, function () {\n            var _this = this;\n            return __generator(this, function (_a) {\n                return [2 /*return*/, new Promise(function (resolve, reject) {\n                        _this.chrome.request('authorize', function (response) {\n                            _this.token = response.token;\n                            resolve();\n                        });\n                    })];\n            });\n        });\n    };\n    GoogleDrive.prototype.list = function () {\n        return __awaiter(this, void 0, void 0, function () {\n            var result;\n            return __generator(this, function (_a) {\n                switch (_a.label) {\n                    case 0: return [4 /*yield*/, fetch(\"https://www.googleapis.com/drive/v3/files?access_token=\" + this.token, {\n                            method: 'GET',\n                            mode: 'cors'\n                        })];\n                    case 1:\n                        result = _a.sent();\n                        return [2 /*return*/, result.json()];\n                }\n            });\n        });\n    };\n    GoogleDrive.prototype.upload = function (imageData, json) {\n        var _this = this;\n        var fileList = json.files.filter(function (file) {\n            return file.name === _this.FOLDER_NAME && file.mimeType === 'application/vnd.google-apps.folder';\n        });\n        if (fileList.length > 0) {\n            this.saveFile(imageData, fileList[0].id);\n        }\n        else {\n            this.createFolder(imageData);\n        }\n    };\n    GoogleDrive.prototype.saveFile = function (imageData, folderId) {\n        console.log('Info: Started sending file to Google Drive...');\n        return fetch(\"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=\" + this.token, {\n            method: 'POST',\n            mode: 'cors',\n            headers: {\n                'content-type': \"multipart/related; boundary=\" + this.BOUNDARY\n            },\n            body: \"--\" + this.BOUNDARY + \"\\nContent-Type: application/json; charset=UTF-8\\n\\n\" + JSON.stringify({ name: imageData.name, parents: [folderId] }) + \"\\n--\" + this.BOUNDARY + \"\\nContent-Type: \" + imageData.mime + \"\\nContent-Transfer-Encoding: base64\\n\\n\" + imageData.data.substring(imageData.data.indexOf('base64,') + 7) + \"\\n--\" + this.BOUNDARY + \"--\"\n        });\n    };\n    GoogleDrive.prototype.createFolder = function (imageData) {\n        return __awaiter(this, void 0, void 0, function () {\n            var response, result;\n            return __generator(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        console.log(\"Info: Folder \\\"\" + this.FOLDER_NAME + \"\\\" is not exist. Creating a new folder...\");\n                        return [4 /*yield*/, fetch(\"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=\" + this.token, {\n                                method: 'POST',\n                                mode: 'cors',\n                                headers: {\n                                    'content-type': \"multipart/related; boundary=\" + this.BOUNDARY\n                                },\n                                body: \"--\" + this.BOUNDARY + \"\\nContent-Type: application/json; charset=UTF-8\\n\\n\" + JSON.stringify({ name: this.FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }) + \"\\n--\" + this.BOUNDARY + \"--\"\n                            })];\n                    case 1:\n                        response = _a.sent();\n                        if (!(response.status === 200)) return [3 /*break*/, 3];\n                        console.log(\"Info: Succeeded creating a new folder \\\"\" + this.FOLDER_NAME + \"\\\".\");\n                        return [4 /*yield*/, response.json()];\n                    case 2:\n                        result = _a.sent();\n                        this.saveFile(imageData, result.id);\n                        return [3 /*break*/, 4];\n                    case 3: throw new Error('Error: Failed to create a new folder.');\n                    case 4: return [2 /*return*/];\n                }\n            });\n        });\n    };\n    return GoogleDrive;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (GoogleDrive);\n\n\n//# sourceURL=webpack:///./src/js/class/GoogleDrive.ts?");

/***/ }),

/***/ "./src/js/class/ImageURL.ts":
/*!**********************************!*\
  !*** ./src/js/class/ImageURL.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar ImageURL = /** @class */ (function () {\n    function ImageURL(url) {\n        if (url === void 0) { url = ''; }\n        this.value = url;\n    }\n    ImageURL.prototype.full = function () {\n        return this.value;\n    };\n    ImageURL.prototype.name = function () {\n        return this.value.substring(this.value.lastIndexOf('/') + 1);\n    };\n    ImageURL.prototype.ext = function () {\n        return this.name().substring(this.name().indexOf('.')).toLowerCase();\n    };\n    ImageURL.prototype.mime = function () {\n        return (this.ext() === '.jpg' || this.ext() === '.jpeg') ? 'image/jpeg'\n            : this.ext() === '.png' ? 'image/png'\n                : 'image/gif';\n    };\n    return ImageURL;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (ImageURL);\n\n\n//# sourceURL=webpack:///./src/js/class/ImageURL.ts?");

/***/ }),

/***/ "./src/js/class/Tweet.ts":
/*!*******************************!*\
  !*** ./src/js/class/Tweet.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TweetImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TweetImage */ \"./src/js/class/TweetImage.ts\");\n\nvar Tweet = /** @class */ (function () {\n    function Tweet(node) {\n        this.element = node;\n        this.imageElements = this.element.querySelectorAll('.AdaptiveMedia img');\n        this.images = Array.from(this.imageElements, function (image) {\n            return new _TweetImage__WEBPACK_IMPORTED_MODULE_0__[\"default\"](image);\n        });\n        this.upload();\n    }\n    Tweet.prototype.upload = function () {\n        if (this.images.length === 0) {\n            return;\n        }\n        this.images.forEach(function (image) {\n            image.upload();\n        });\n    };\n    return Tweet;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tweet);\n\n\n//# sourceURL=webpack:///./src/js/class/Tweet.ts?");

/***/ }),

/***/ "./src/js/class/TweetImage.ts":
/*!************************************!*\
  !*** ./src/js/class/TweetImage.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ImageURL__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageURL */ \"./src/js/class/ImageURL.ts\");\n/* harmony import */ var _GoogleDrive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GoogleDrive */ \"./src/js/class/GoogleDrive.ts\");\n\n\nvar TweetImage = /** @class */ (function () {\n    function TweetImage(node) {\n        this.element = node;\n        this.url = new _ImageURL__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.element.src);\n        this.image = null;\n    }\n    TweetImage.prototype.upload = function () {\n        var _this = this;\n        this.image = new Image();\n        this.image.crossOrigin = 'Anonymous';\n        this.image.addEventListener('load', function (e) {\n            new _GoogleDrive__WEBPACK_IMPORTED_MODULE_1__[\"default\"]().save({\n                data: _this.dataURL(),\n                name: _this.url.name(),\n                mime: _this.url.mime()\n            });\n        }, false);\n        this.image.src = this.url.full();\n    };\n    TweetImage.prototype.dataURL = function () {\n        var canvas = document.createElement('canvas');\n        canvas.width = this.image.naturalWidth;\n        canvas.height = this.image.naturalHeight;\n        var ctx = canvas.getContext('2d');\n        ctx.drawImage(this.image, 0, 0);\n        return canvas.toDataURL(this.url.mime());\n    };\n    return TweetImage;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (TweetImage);\n\n\n//# sourceURL=webpack:///./src/js/class/TweetImage.ts?");

/***/ }),

/***/ "./src/js/class/Twitter.ts":
/*!*********************************!*\
  !*** ./src/js/class/Twitter.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ClickTarget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClickTarget */ \"./src/js/class/ClickTarget.ts\");\n\nvar Twitter = /** @class */ (function () {\n    function Twitter() {\n        document.addEventListener('click', this.onClick.bind(this));\n    }\n    Twitter.prototype.onClick = function (e) {\n        new _ClickTarget__WEBPACK_IMPORTED_MODULE_0__[\"default\"](e.target);\n    };\n    return Twitter;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Twitter);\n\n\n//# sourceURL=webpack:///./src/js/class/Twitter.ts?");

/***/ }),

/***/ "./src/js/content.ts":
/*!***************************!*\
  !*** ./src/js/content.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _class_Twitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class/Twitter */ \"./src/js/class/Twitter.ts\");\n\nnew _class_Twitter__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack:///./src/js/content.ts?");

/***/ })

/******/ });