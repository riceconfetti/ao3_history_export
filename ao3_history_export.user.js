// ==UserScript==
// @name        AO3 History Export
// @namespace   https://github.com/riceconfetti
// @version     1
// @description Export reading history to csv.
// @match       https://archiveofourown.org/users/*/readings
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL   https://github.com/riceconfetti/ao3_history_export/raw/main/ao3_history_export.user.js
// @require     https://github.com/riceconfetti/ao3_history_export/raw/main/ao3_history_export.user.js
// ==/UserScript==

$(function() {
  $('.navigation.actions').append("<li><a id="ao3_download_history">Download</span></li>");
  $('#a03_download_history').click(downloadHistory);
});

function downloadHistory() {

}
