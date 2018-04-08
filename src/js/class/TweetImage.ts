import ImageURL from './ImageURL'
import GoogleDrive from './GoogleDrive'

export default class TweetImage {
  private element: HTMLImageElement
  private url: ImageURL
  private image: HTMLImageElement

  constructor (node: HTMLImageElement) {
    this.element = node
    this.url = new ImageURL(this.element.src)
    this.image = null
  }

  public upload () : void {
    this.image = new Image()
    this.image.crossOrigin = 'Anonymous'
    this.image.addEventListener('load', e => {
      new GoogleDrive().save({
        data: this.dataURL(),
        name: this.url.name(),
        mime: this.url.mime()
      })
    }, false)
    this.image.src = this.url.full()
  }

  public dataURL () : string {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = this.image.naturalWidth
    canvas.height = this.image.naturalHeight

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    ctx.drawImage(this.image, 0, 0)

    return canvas.toDataURL(this.url.mime())
  }
}
 