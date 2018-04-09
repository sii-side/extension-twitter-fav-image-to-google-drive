import Chrome from './Chrome'
import GoogleDriveHttp from './GoogleDriveHttp';

interface IImageData extends Object {
  data: string,
  name: string,
  mime: string
}

export default class GoogleDrive {
  private chrome: Chrome = new Chrome()
  private http: GoogleDriveHttp = new GoogleDriveHttp()
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
      return file.name === this.http.name() && file.mimeType === 'application/vnd.google-apps.folder';
    })

    if (fileList.length > 0) {
      this.saveFile(imageData, fileList[0].id)
    } else {
      this.createFolder(imageData)
    }
  }

  private async saveFile (imageData: IImageData, folderId: string) : Promise<any> {
    console.log('Info: Started sending file to Google Drive...');
    
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${this.token}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': this.http.contentType()
      },
      body: this.http.imageFile(imageData, folderId)
    })

    if (response.ok) {
      console.log(`Info: Succeeded to save file -> ${imageData.name}`)
    }
  }

  private async createFolder (imageData: IImageData) : Promise<any> {
    console.log(`Info: Folder "${this.http.name()}" is not exist. Creating a new folder...`);

    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${this.token}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': this.http.contentType()
      },
      body: this.http.folder()
    })

    if (response.ok) {
      console.log(`Info: Succeeded creating a new folder "${this.http.name()}".`)
      const result = await response.json()
      this.saveFile(imageData, result.id)
    } else {
      throw new Error('Error: Failed to create a new folder.')
    }
  }
}
