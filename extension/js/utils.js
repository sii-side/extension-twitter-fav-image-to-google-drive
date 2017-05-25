'use strict';

var getAncestorElementByClassName = function callee(node) {
  if (node === document) {
    return null;
  }

  for (var _len = arguments.length, classes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classes[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < classes.length; i++) {
    if (node.classList.contains(classes[i]) === false) {
      return callee.apply(undefined, [node.parentNode].concat(classes));
    }
  }

  return node;
};

var imageToDataURL = function imageToDataURL(imgObj, mimeType) {
  mimeType = mimeType || 'image/png';

  var canvas = document.createElement('canvas');
  canvas.width = imgObj.naturalWidth;
  canvas.height = imgObj.naturalHeight;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(imgObj, 0, 0);

  return canvas.toDataURL(mimeType);
};

var requestAuthorization = function requestAuthorization() {
  var isInteractive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var callback = arguments[1];

  chrome.runtime.sendMessage({
    type: 'authorize',
    interactive: isInteractive
  }, function (response) {
    if (typeof callback === 'function') {
      callback(response);
    }
  });
};

var requestUserInfo = function requestUserInfo(callback) {
  chrome.runtime.sendMessage({
    type: 'userinfo'
  }, function (response) {
    if (typeof callback === 'function') {
      callback(response);
    }
  });
};

var saveToGoogleDrive = function saveToGoogleDrive(data, fileName, mimeType, callback) {
  var FOLDER_NAME = 'T2GD';
  var BOUNDARY = 'hoge_fuga_piyo';
  var token = void 0;

  new Promise(function (resolve, reject) {
    console.log('Info: Started authorizing...');

    requestAuthorization(false, function (response) {
      if (response.token) {
        console.log('Info: Succeeded authorizing. Access token is -> ' + response.token);
        token = response.token;
        resolve();
      } else {
        reject(new Error('Error: Failed to get access token.'));
      }
    });
  }).then(function () {
    console.log('Info: Started getting file list...');

    return fetch('https://www.googleapis.com/drive/v3/files?access_token=' + token, {
      method: 'GET',
      mode: 'cors'
    });
  }).then(function (response) {
    if (response.status === 200) {
      console.log('Info: Succeeded getting file list.');
      return response.json();
    } else {
      throw new Error('Error: Failed to get file list.');
    }
  }).then(function (json) {
    return new Promise(function (resolve, reject) {
      var fileList = json.files.filter(function (file) {
        return file.name === FOLDER_NAME && file.mimeType === 'application/vnd.google-apps.folder';
      });

      if (fileList.length > 0) {
        console.log('Info: Folder "T2GD" is already exist.');
        resolve(fileList[0].id);
      } else {
        console.log('Info: Folder "' + FOLDER_NAME + '" is not exist. Creating a new folder...');
        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=' + token, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'content-type': 'multipart/related; boundary=' + BOUNDARY
          },
          body: '--' + BOUNDARY + '\nContent-Type: application/json; charset=UTF-8\n\n' + JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }) + '\n--' + BOUNDARY + '--'
        }).then(function (response) {
          if (response.status === 200) {
            console.log('Info: Succeeded creating a new folder "' + FOLDER_NAME + '".');
            return response.json();
          } else {
            throw new Error('Error: Failed to create a new folder.');
          }
        }).then(function (fileInfo) {
          resolve(fileInfo.id);
        });
      }
    });
  }).then(function (folderId) {
    console.log('Info: Started sending file to Google Drive...');

    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=' + token, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'multipart/related; boundary=' + BOUNDARY
      },
      body: '--' + BOUNDARY + '\nContent-Type: application/json; charset=UTF-8\n\n' + JSON.stringify({ name: fileName, parents: [folderId] }) + '\n--' + BOUNDARY + '\nContent-Type: ' + mimeType + '\nContent-Transfer-Encoding: base64\n\n' + data.substring(data.indexOf('base64,') + 7) + '\n--' + BOUNDARY + '--'
    });
  }).then(function (response) {
    if (response.status === 200) {
      callback('Success: ' + fileName + ' was uploaded.');
    } else {
      throw new Error('Error: Failed to upload ' + fileName);
    }
  }).catch(function (error) {
    callback(error);
  });
};