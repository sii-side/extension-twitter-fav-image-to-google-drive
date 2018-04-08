import TweetImage from './TweetImage'

export default class Tweet {
  private element: HTMLElement
  private imageElements: NodeListOf<HTMLImageElement>
  private images: Array<TweetImage>

  constructor (node: HTMLElement) {
    this.element = node
    this.imageElements = this.element.querySelectorAll('.AdaptiveMedia img')
    this.images = Array.from(this.imageElements, (image: HTMLImageElement) => {
      return new TweetImage(image)
    })
    this.upload()
  }

  private upload () : void {
    if (this.images.length === 0) {
      return
    }
    this.images.forEach(image => {
      image.upload()
    })
  }
}
