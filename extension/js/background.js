'use strict';

(function () {

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'authorize') {
      chrome.identity.getAuthToken({
        interactive: request.interactive
      }, function (token) {
        if (token) {
          sendResponse({
            token: token
          });
        } else {
          sendResponse('failed');
        }
      });
    }

    if (request.type === 'userinfo') {
      chrome.identity.getProfileUserInfo(function (userInfo) {
        sendResponse(userInfo);
      });
    }

    return true;
  });

  new Promise(function (resolve) {
    chrome.runtime.onInstalled.addListener(resolve);
  }).then(function () {
    return new Promise(function (resolve) {
      chrome.declarativeContent.onPageChanged.removeRules(undefined, resolve);
    });
  }).then(function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'twitter.com',
          schemes: ['https']
        }
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
})();