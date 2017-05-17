(() => {
  const main = document.querySelector('main');

  //****************************************
  // Attach Form Events
  //****************************************

  document.querySelector('#btn-login').addEventListener('click', e => {
    requestAuthorization(true);
  }, false);

  //****************************************
  // Main
  //****************************************

  //ログイン済みかどうかをbackgroundで検証
  requestUserInfo(response => {
    if (response.id) {
      requestAuthorization(true, response => {
        if (response.token) {
          main.innerHTML = '<p>We are ready for uploading images to Google Drive.</p>';
        } else {
          main.innerHTML = '<p class="text-danger">Logged in. But failed to get access token. Please log in Google again.</p>';
        }
      });
    }
  });
})();