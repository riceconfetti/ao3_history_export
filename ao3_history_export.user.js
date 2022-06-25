// ==UserScript==
// @name        AO3 History Export
// @namespace   https://github.com/riceconfetti
// @version     1.3
// @description Export reading history to csv.
// @match       https://archiveofourown.org/users/*/readings*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL   https://github.com/riceconfetti/ao3_history_export/raw/main/ao3_history_export.user.js
// ==/UserScript==
$('.navigation.actions').append('<li><a id="ao3_download_history">Download</span></li>');
$('#ao3_download_history').click(downloadCSV);


const e = t => new Promise(e => {
  const n = new XMLHttpRequest;
  n.onload = (() => e(n.responseText));
  n.open('GET', t, false);
  n.send()
});

const n = t => Array.from(t.querySelectorAll('#main ol li.reading.work')).map(l);
const r = (t, e) => t === null ? null : t[e];
const o = t => t === null ? null : Array.from(t).map(t => t.innerHTML);
const l = t => ({
  title: function() {return t.querySelector('div .heading a').innerHTML;},
  author: function() {
    if (t.querySelector('div .heading a[rel="author"]') === null) {
        let html = t.querySelector('div .heading').innerHTML;
      	//return html;
    		return html.slice(html.indexOf("-->")+ 6,html.length).trim();
    } else {
      return t.querySelector('div .heading a[rel="author"]').innerHTML;
    }
  },
  fandoms: function() {
    var fandoms = t.querySelectorAll('div .fandoms a');
    var fText = new Array();
    for (var i=0; i< fandoms.length; ++i ) {
      fText[i] = fandoms[i].outerText;
    } return fText;
  },
  summary: function() {return t.querySelector('blockquote p').outerText;},
  tags: function() {
    var tags = t.querySelectorAll('.tags li a');
    var tText = new Array();
    for (var i=0; i< tags.length; ++i ) {
      tText[i] = tags[i].outerText;
    } return tText;
  }
});
const c = t => t.querySelector('a[rel="next"]');
const s = t => new Promise(e => setTimeout(e, t));
const d=()=>(new Date).getDay()===0;
let history = "data:text/csv;charset=utf-8,";

async function g(r) {
  if (d())return alert("Don't run this script on Sundays");
  let a = 1;
  const o = new DOMParser;
  while (r !== null) {
    if (a > 10) {
      break;
    }
    a++;
    const t = o.parseFromString(await e(r), 'text/html');
    let q = n(t);
    for (let i=0; i< q.length; ++i) {
      console.log(q[i].title() +"  "+ q[i].author());
    	let row = q[i].title() + "," + q[i].author() + ",";
      for (let j=0; j< q[i].fandoms().length; ++j) {
        row += q[i].fandoms()[j] +";"
      }
      row += "," + q[i].summary() + ",";
      for (let j=0; j< q[i].tags().length; ++j) {
        row += q[i].tags()[j] +";"
      }
      row += "\n";
      history += row;
      //console.log(row);
    }
    const l = c(t);
    r = l ? l.href : null;
    console.log(r);
    await s(a < 1e3 ? 3e3 : 1e4);
  }
}

g(location.href);


function downloadCSV() {
  var encodedUri = encodeURI(history);
  $('#ao3_download_history').attr("download", "history.csv").attr("href", encodedUri);
  $('#ao3_download_history').click();
}
