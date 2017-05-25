//--------------------------------------------------
// DOM関連
//--------------------------------------------------

/**
 * 自身を含む祖先要素のうち、指定されたclassをすべて持つ最初の要素（該当が無い場合はnull）を返す関数
 * @param {HTMLElement} node 始点となるノード
 * @param {string[, string, string...]} classes class文字列の配列
 */
const getAncestorElementByClassName = function callee(node, ...classes) {
  //documentに達した場合はnullを返して終了（＝該当無し）
  if (node === document) {
    return null;
  }
  //1つでも該当しないclassがあったら親ノードで再帰
  for (let i = 0; i < classes.length; i++) {
    if (node.classList.contains(classes[i]) === false) {
      return callee(node.parentNode, ...classes);
    }
  }
  //すべてのclassを持っており再帰がかからなかった場合はノードを返す
  return node;
};

/**
 * 画像をData URIに変換
 * @param {HTMLImageElement} imgObj 画像
 * @param {string} mimeType 出力時のmimeType
 */
const imageToDataURL = (imgObj, mimeType) => {
  /**
   * @default image/png
   */
  mimeType = mimeType || 'image/png';

  const canvas = document.createElement('canvas');
  canvas.width = imgObj.naturalWidth;
  canvas.height = imgObj.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgObj, 0, 0);

  return canvas.toDataURL(mimeType);
};

//--------------------------------------------------
// Chrome API関連
//--------------------------------------------------

/**
 * Background scriptにaccess tokenを要求
 * @param {boolean} isInteractive 認証モード切り替え
 * @param {function} callback レスポンスに対するcallback
 */
const requestAuthorization = (isInteractive = true, callback) => {
  chrome.runtime.sendMessage({
    type: 'authorize',
    interactive: isInteractive
  }, response => {
    if (typeof callback === 'function') {
      callback(response);
    }
  });
};

/**
 * Background scriptにuser informationを要求
 * @param {function} callback レスポンスに対するcallback
 */
const requestUserInfo = callback => {
  chrome.runtime.sendMessage({
    type: 'userinfo'
  }, response => {
    if (typeof callback === 'function') {
      callback(response);
    }
  });
};

//--------------------------------------------------
// Google Drive関連
//--------------------------------------------------

/**
 * データをGoogle Driveに送信
 * @param {string} data Base64エンコードしたデータ
 * @param {string} fileName 保存時のファイル名
 * @param {string} mimeType 送信時のmimeType
 * @param {function} callback 処理終了時のコールバック
 */
const saveToGoogleDrive = (data, fileName, mimeType, callback) => {
  const FOLDER_NAME = 'T2GD';
  const BOUNDARY = 'hoge_fuga_piyo';
  let token;

  /**
   * (1) トークン取得
   * (2) ファイルリスト取得（フォルダID取得）
   * (3) （必要なら）フォルダ作成
   * (4) ファイル送信
   */
  //(1)
  new Promise((resolve, reject) => {
    console.log('Info: Started authorizing...');

    requestAuthorization(false, response => {
      if (response.token) {
        console.log('Info: Succeeded authorizing. Access token is -> ' + response.token);
        token = response.token;
        resolve();
      } else {
        reject(new Error('Error: Failed to get access token.'));
      }
    });
  //(2)
  }).then(() => {
    console.log('Info: Started getting file list...');

    return fetch(`https://www.googleapis.com/drive/v3/files?access_token=${token}`, {
      method: 'GET',
      mode: 'cors'
    });
  }).then(response => {
    if(response.status === 200) {
      console.log('Info: Succeeded getting file list.');
      return response.json();
    } else {
      throw new Error('Error: Failed to get file list.');
    }
  //(3)
  }).then(json => {
    return new Promise((resolve, reject) => {
      const fileList = json.files.filter(file => {
        return file.name === FOLDER_NAME && file.mimeType === 'application/vnd.google-apps.folder';
      });

      //既にTwitterフォルダが存在するのでidを渡す
      if(fileList.length > 0) {
        console.log('Info: Folder "T2GD" is already exist.');
        resolve(fileList[0].id);
      //Twitterフォルダが存在しないので新規作成しidを取得
      } else {
        console.log(`Info: Folder "${FOLDER_NAME}" is not exist. Creating a new folder...`);
        fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${token}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'content-type': `multipart/related; boundary=${BOUNDARY}`
          },
          body:
`--${BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' })}
--${BOUNDARY}--`
        }).then(response => {
          if (response.status === 200) {
            console.log(`Info: Succeeded creating a new folder "${FOLDER_NAME}".`);
            return response.json();
          } else {
            throw new Error('Error: Failed to create a new folder.');
          }
        }).then(fileInfo => {
          resolve(fileInfo.id);
        });
      }
    });
  //(4)
  }).then(folderId => {
    console.log('Info: Started sending file to Google Drive...');

    return fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${token}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': `multipart/related; boundary=${BOUNDARY}`
      },
      body:
`--${BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: fileName, parents: [folderId] })}
--${BOUNDARY}
Content-Type: ${mimeType}
Content-Transfer-Encoding: base64

${data.substring(data.indexOf('base64,') + 7)}
--${BOUNDARY}--`
    });
  }).then(response => {
    if (response.status === 200) {
      callback(`Success: ${fileName} was uploaded.`);
    } else {
      throw new Error(`Error: Failed to upload ${fileName}`);
    }
  }).catch(error => {
    callback(error);
  });
};