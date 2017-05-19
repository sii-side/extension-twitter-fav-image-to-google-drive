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
  var BOUNDARY = 'hoge_fuga_piyo';
  var requestBody = '--' + BOUNDARY + '\nContent-Type: application/json; charset=UTF-8\n\n' + JSON.stringify({ name: fileName }) + '\n--' + BOUNDARY + '\nContent-Type: ' + mimeType + '\nContent-Transfer-Encoding: base64\n\n' + data.substring(data.indexOf('base64,') + 7) + '\n--' + BOUNDARY + '--';

  new Promise(function (resolve, reject) {
    requestAuthorization(false, function (response) {
      if (response.token) {
        resolve(response.token);
      } else {
        reject('Error: Failed to get access token.');
      }
    });
  }).then(function (token) {
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&access_token=' + token, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'multipart/related; boundary=' + BOUNDARY
      },
      body: requestBody
    }).then(function (response) {
      if (response.status === 200) {
        callback('Success: ' + fileName + ' was uploaded.');
      } else {
        callback('Error: Failed to upload ' + fileName);
      }
    });
  }).catch(function (error) {
    callback(error);
  });
};