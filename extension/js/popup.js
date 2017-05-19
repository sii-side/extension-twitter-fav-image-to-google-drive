'use strict';

(function () {
  var main = document.querySelector('main');

  requestUserInfo(function (response) {
    if (response.id) {
      requestAuthorization(true, function (response) {
        if (response.token) {
          main.innerHTML = '<p>We are ready for uploading images to Google Drive!</p>';
        } else {
          main.innerHTML = '<p class="text-danger">Logged in. But failed to get access token. Please log out and log in again.</p>';
        }
      });
    } else {
      main.innerHTML = '\n        <h1>Please log in Google</h1>\n        <button id="btn-login" class="btn btn-block btn-success">Log in</button>\n      ';

      document.querySelector('#btn-login').addEventListener('click', function (e) {
        requestAuthorization(true);
      }, false);
    }
  });
})();