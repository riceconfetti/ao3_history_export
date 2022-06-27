// ==UserScript==
// @name        AO3 History Export
// @namespace   https://github.com/riceconfetti
// @version     1.6
// @description Export reading history to tsv.
// @match       https://archiveofourown.org/users/*/readings*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL   https://github.com/riceconfetti/ao3_history_export/raw/main/ao3_history_export.user.js
// ==/UserScript==

const e = t => new Promise(e => {
  const n = new XMLHttpRequest;
  n.onload = (() => e(n.responseText));
  n.open('GET', t, false);
  n.send()
});

const n = t => Array.from(t.querySelectorAll('#main ol li.reading.work:not(.deleted)')).map(l);
const r = (t, e) => t === null ? null : t[e];
const o = t => t === null ? null : Array.from(t).map(t => t.innerHTML);

const l = t => ({
  title: t.querySelector('div .heading a').innerText.trim(),
  summary: t.querySelector("blockquote.summary"),
  author: function() {
    if (t.querySelector('div .heading a[rel="author"]') === null) {
        let text = t.querySelector('div .heading').innerText.trim();
      	text = text.slice(text.indexOf("by")+ 6,text.length);
      	//console.log(text.trim());
    		return text.trim();
    } else {
      return t.querySelector('div .heading a[rel="author"]').innerText.trim();
    }
  },
  fandoms: function() {
    var fandoms = t.querySelectorAll('div .fandoms a.tag');
    var fText = new Array();
    for (var i=0; i< fandoms.length; ++i ) {
      fText[i] = fandoms[i].innerText.trim();
      //console.log(fText[i]);
    }//console.log(fText);
    return fText;
  },
  tags: function() {
    var tags = t.querySelectorAll('.tags li a');
    var tText = new Array();
    for (var i=0; i< tags.length; ++i ) {
      tText[i] = tags[i].innerText.trim();
    } return tText;
  }
});

const c = t => t.querySelector('a[rel="next"]');
const s = t => new Promise(e => setTimeout(e, t));
const d=()=>(new Date).getDay()===0;

async function g(r) {
  //if (d())return alert("Don't run this script on Sundays");
  let a = 1;
  let history = "data:text/txt;charset=utf-8\t";
  const o = new DOMParser;
  while (r !== null) {
    a++;
    if (a >30 )
      break;
    const t = o.parseFromString(await e(r), 'text/html');
    let q = n(t);
    console.log(q);

    for (let i=0; i< q.length; ++i) {
      //console.log(q[i].title +"  "+ q[i].author());
    	let row = q[i].title + "\t" + q[i].author() + "\t";
      console.log(row)
      var fandoms = q[i].fandoms();
      console.log(fandoms);

      for (let j=0; j< fandoms.length; ++j) {
        row += "[" + fandoms[j] +"] ";
      }

      var summary = (q[i].summary === null) ? "" : q[i].summary.innerText.trim().replace(/(\r\n|\n|\r)/gm, "");

      row += "\t" + summary + "\t";
      console.log(summary);
      var tags = q[i].tags();
      for (let j=0; j< tags.length; ++j) {
        row += "[" + tags[j] +"] ";
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

  console.log(history);

  var encodedUri = encodeURI(history);
  window.open(encodedUri);
  var link = document.createElement("a");
  link.innerHTML="Download Data";
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "history.txt");
  var listItem = document.createElement("li");
  listItem.appendChild(link)
	$(".navigation.actions").append(listItem);

  alert("Done!");
}

g(location.href);
