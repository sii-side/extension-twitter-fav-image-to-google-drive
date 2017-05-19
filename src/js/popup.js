(() => {
  const main = document.querySelector('main');

  //ログイン済みかどうかをbackgroundで検証
  requestUserInfo(response => {
    if (response.id) {  //ログイン済み
      //access tokenの取得を試行
      requestAuthorization(true, response => {
        if (response.token) {
          main.innerHTML = '<p>We are ready for uploading images to Google Drive!</p>';
        } else {
          main.innerHTML = '<p class="text-danger">Logged in. But failed to get access token. Please log out and log in again.</p>';
        }
      });
    } else {  //未ログイン
      //ログインを促すボタンを表示
      main.innerHTML = `
        <h1>Please log in Google</h1>
        <button id="btn-login" class="btn btn-block btn-success">Log in</button>
      `;

      document.querySelector('#btn-login').addEventListener('click', e => {
        requestAuthorization(true);
      }, false);
    }
  });
})();