import Chrome from './Chrome'

interface IImageData extends Object {
  data: string,
  name: string,
  mime: string
}

export default class GoogleDrive {
  private FOLDER_NAME: string = 'T2GD'
  private BOUNDARY: string = 'hoge_fuga_piyo'
  private chrome: Chrome = new Chrome()
  private token: string

  public async save (imageData: IImageData) : Promise<any> {
    await this.getToken()
    const list: gapi.client.drive.FileList = await this.list()
    this.upload(imageData, list)
  }

  private async getToken () : Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      this.chrome.request('authorize', response => {
        this.token = response.token
        resolve()
      })
    })
  }

  private async list () : Promise<any> {
    const result: Response = await fetch(`https://www.googleapis.com/drive/v3/files?access_token=${this.token}`, {
      method: 'GET',
      mode: 'cors'
    })
    return result.json()
  }

  private upload (imageData: IImageData, json: gapi.client.drive.FileList) : void {
    const fileList: Array<any> = json.files.filter(file => {
      return file.name === this.FOLDER_NAME && file.mimeType === 'application/vnd.google-apps.folder';
    })

    if (fileList.length > 0) {
      this.saveFile(imageData, fileList[0].id)
    } else {
      this.createFolder(imageData)
    }
  }

  private saveFile (imageData: IImageData, folderId: string) {
    console.log('Info: Started sending file to Google Drive...');
    
    return fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${this.token}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': `multipart/related; boundary=${this.BOUNDARY}`
      },
      body:
`--${this.BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: imageData.name, parents: [folderId] })}
--${this.BOUNDARY}
Content-Type: ${imageData.mime}
Content-Transfer-Encoding: base64

${imageData.data.substring(imageData.data.indexOf('base64,') + 7)}
--${this.BOUNDARY}--`
    })
  }

  private async createFolder (imageData: IImageData) {
    console.log(`Info: Folder "${this.FOLDER_NAME}" is not exist. Creating a new folder...`);
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${this.token}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': `multipart/related; boundary=${this.BOUNDARY}`
      },
      body:
`--${this.BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: this.FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' })}
--${this.BOUNDARY}--`
    })

    if (response.status === 200) {
      console.log(`Info: Succeeded creating a new folder "${this.FOLDER_NAME}".`)
      const result = await response.json()
      this.saveFile(imageData, result.id)
    } else {
      throw new Error('Error: Failed to create a new folder.')
    }
  }
}
