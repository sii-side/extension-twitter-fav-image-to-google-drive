export default class ImageURL {
  private value: string

  constructor (url: string = '') {
    this.value = url
  }

  public full () : string {
    return this.value
  }

  public name () : string {
    return this.value.substring(this.value.lastIndexOf('/') + 1)
  }

  public ext () : string {
    return this.name().substring(this.name().indexOf('.')).toLowerCase()
  }

  public mime () : string {
    return (this.ext() === '.jpg' || this.ext() === '.jpeg') ? 'image/jpeg'
      : this.ext() === '.png' ? 'image/png'
      : 'image/gif'
  }
}
