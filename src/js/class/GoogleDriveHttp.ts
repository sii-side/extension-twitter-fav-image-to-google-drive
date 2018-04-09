export default class GoogleDriveHttp {
  private FOLDER_NAME: string = 'T2GD'
  private BOUNDARY: string = 'hoge_fuga_piyo'

  public name () : string {
    return this.FOLDER_NAME
  }

  public contentType () : string {
    return `multipart/related; boundary=${this.BOUNDARY}`
  }

  public folder () : string {
    return `
--${this.BOUNDARY}
Content-Type: application/json; charset=UTF-8
    
${JSON.stringify({ name: this.FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' })}
--${this.BOUNDARY}--`
  }

  public imageFile (imageData, folderId) : string {
    return `--${this.BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: imageData.name, parents: [folderId] })}
--${this.BOUNDARY}
Content-Type: ${imageData.mime}
Content-Transfer-Encoding: base64

${imageData.data.substring(imageData.data.indexOf('base64,') + 7)}
--${this.BOUNDARY}--`
  }
}
