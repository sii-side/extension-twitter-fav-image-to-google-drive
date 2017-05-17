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

/**
 * データをGoogle Driveに送信
 * @param {string} data Base64エンコードしたデータ
 * @param {string} fileName 保存時のファイル名
 * @param {string} mimeType 送信時のmimeType
 * @param {function} callback 処理終了時のコールバック
 */
const saveToGoogleDrive = (data, fileName, mimeType, callback) => {
  const BOUNDARY = 'hoge_fuga_piyo';
  const requestBody =
`--${BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: fileName })}
--${BOUNDARY}
Content-Type: ${mimeType}
Content-Transfer-Encoding: base64

${data.substring(data.indexOf('base64,') + 7)}
--${BOUNDARY}--`;

  new Promise((resolve, reject) => {
    requestAuthorization(false, response => {
      if (response.token) {
        resolve(response.token);
      } else {
        reject('error');
      }
    });
  }).then(token => {
    fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=${token}`, {
      method: 'POST',
      headers: {
        'content-type': `multipart/related; boundary=${BOUNDARY}`
      },
      body: requestBody
    }).then(response => {
      callback(response);
    });
  }, error => {
    callback(error);
  });
};