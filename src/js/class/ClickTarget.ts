import Tweet from './Tweet'

export default class ClickTarget {
  private element: HTMLElement

  constructor (element: HTMLElement) {
    this.element = element
    this.tweet()
  }

  private tweet () : void {
    if (this.isFavorite()) {
      new Tweet(this.ancestor(['tweet']))
    }
  }

  private isFavorite () : boolean {
    return !!this.ancestor(['js-actionFavorite', 'ProfileTweet-actionButton'])
  }

  private ancestor (classes: Array<string>, element = this.element) : HTMLElement {
    if (!element || !element.classList) {
      return null
    }
    if (classes.every(cls => element.classList.contains(cls))) {
      return element
    }
    return this.ancestor(classes, element.parentElement)
  }
}
