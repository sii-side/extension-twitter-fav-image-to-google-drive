import Chrome from './Chrome'

export default class Popup {
  private chrome: Chrome
  private element: HTMLElement

  constructor () {
    this.chrome = new Chrome()
    this.element = document.querySelector('main')
    this.init()
  }

  public init () : void {
    this.chrome.request('userinfo', response => {
      this.validateLogin(response)
    })
  }

  private validateLogin (userinfo: chrome.identity.UserInfo) : void {
    if (userinfo.id) {
      this.display('Logged in successfully.')
    } else {
      this.display('Not logged in. Please log in Chrome.')
    }
  }

  private display (text) : void {
    this.element.innerHTML = text
  }
}
