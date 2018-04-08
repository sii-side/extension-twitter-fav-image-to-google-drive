import ClickTarget from './ClickTarget'

export default class Twitter {
  constructor () {
    document.addEventListener('click', this.onClick.bind(this))
  }

  private onClick (e: Event) : void {
    new ClickTarget(<HTMLElement>e.target)
  }
}
