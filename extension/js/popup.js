'use strict';

(function () {
  var main = document.querySelector('main');

  document.querySelector('#btn-login').addEventListener('click', function (e) {
    requestAuthorization(true);
  }, false);

  requestUserInfo(function (response) {
    if (response.id) {
      requestAuthorization(true, function (response) {
        if (response.token) {
          main.innerHTML = '<p>We are ready for uploading images to Google Drive.</p>';
        } else {
          main.innerHTML = '<p class="text-danger">Logged in. But failed to get access token. Please log in Google again.</p>';
        }
      });
    }
  });
})();