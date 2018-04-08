export default class Chrome {
  public background () : void {
    this.listener()
    this.rule()
  }

  public request (type: string, callback: Function) {
    chrome.runtime.sendMessage({
      type: type
    }, response => {
      if (typeof callback === 'function') {
        callback(response)
      }
    })
  }

  private listener () : void {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (typeof this[request.type] === 'function') {
        this[request.type](sendResponse)
      }
      return true
    })
  }

  private authorize (sendResponse: Function) : void {
    chrome.identity.getAuthToken({
      interactive: false
    }, token => {
      token ? sendResponse({ token: token }) : sendResponse('failed')
    })
  }

  private userinfo (sendResponse: Function) : void {
    chrome.identity.getProfileUserInfo(userInfo => {
      sendResponse(userInfo)
    })
  }

  private rule () : void {
    chrome.runtime.onInstalled.addListener(this.removeRule)
  }

  private removeRule () : void {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, this.addRule)
  }

  private addRule () : void {
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
    }])
  }
}
