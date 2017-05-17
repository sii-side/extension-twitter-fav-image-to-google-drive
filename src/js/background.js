(() => {
  //****************************************
  // onMessage Event Handler
  //****************************************

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    /**
     * Authorization
     */
    if(request.type === 'authorize') {
      chrome.identity.getAuthToken({
        interactive: request.interactive
      }, token => {
        if(token) {
          sendResponse({
            token: token
          });
        } else {
          sendResponse('failed');
        }
      });
    }

    /**
     * User Information
     */
    if(request.type === 'userinfo') {
      chrome.identity.getProfileUserInfo(userInfo => {
        sendResponse(userInfo);
      });
    }

    return true;
  });

  //****************************************
  // Page Action Initialization
  //****************************************

  /**
   * Twitterにアクセスした際にアイコンが活性化されるようルール設定
   */
  new Promise(resolve => {
    //インストール時とアップデート時に実行
    chrome.runtime.onInstalled.addListener(resolve);
  }).then(() => {
    return new Promise(resolve => {
      //元のルールを削除した上で、
      chrome.declarativeContent.onPageChanged.removeRules(undefined, resolve);
    });
  }).then(() => {
    //再度新しいルールを設定する
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostEquals: 'twitter.com',
            schemes: ['https']
          }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
})();