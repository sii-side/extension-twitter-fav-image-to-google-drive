(() => {
  //イベントリスナはdocumentに置き、発生源（e.target）で判断
  document.addEventListener('click', e => {
    if (getAncestorElementByClassName(e.target, 'js-actionFavorite', 'ProfileTweet-actionButton') !== null) {
      const tweet = getAncestorElementByClassName(e.target, 'tweet'); //ツイート
      const img = tweet.querySelectorAll('.AdaptiveMedia img') || []; //の中の画像一式

      [].forEach.call(img, img => {
        //URLからファイル名切り出し → 拡張子切り出し → MIME Type判定
        const fileName = img.src.substring(img.src.lastIndexOf('/') + 1);
        const fileExt = fileName.substring(fileName.indexOf('.')).toLowerCase();
        const mimeType = (fileExt === '.jpg' || fileExt === '.jpeg') ? 'image/jpeg' : fileExt === '.png' ? 'image/png' : 'image/gif';

        //画像を読み込んでData URIに変換し、Google Driveにアップロード
        const tmpImg = new Image();
        tmpImg.crossOrigin = 'Anonymous';
        tmpImg.addEventListener('load', e => {
          saveToGoogleDrive(imageToDataURL(tmpImg, mimeType), fileName, mimeType, response => {
            console.dir(response);
          });
        }, false);
        tmpImg.src = img.src;
      });
    }
  }, false);
})();