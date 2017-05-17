'use strict';

(function () {
  document.addEventListener('click', function (e) {
    if (getAncestorElementByClassName(e.target, 'js-actionFavorite', 'ProfileTweet-actionButton') !== null) {
      var tweet = getAncestorElementByClassName(e.target, 'tweet');
      var img = tweet.querySelectorAll('.AdaptiveMedia img') || [];

      [].forEach.call(img, function (img) {
        var fileName = img.src.substring(img.src.lastIndexOf('/') + 1);
        var fileExt = fileName.substring(fileName.indexOf('.')).toLowerCase();
        var mimeType = fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : fileExt === '.png' ? 'image/png' : 'image/gif';

        var tmpImg = new Image();
        tmpImg.crossOrigin = 'Anonymous';
        tmpImg.addEventListener('load', function (e) {
          var data = imageToDataURL(tmpImg, mimeType);
          saveToGoogleDrive(data, fileName, mimeType, function (response) {
            if (response.status === 200) {
              console.log('Saved successfully: ' + fileName);
            }
          });
        }, false);
        tmpImg.src = img.src;
      });
    }
  }, false);
})();