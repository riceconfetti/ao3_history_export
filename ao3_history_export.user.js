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
$('#ao3_download_history').click(downloadHistory);

function downloadHistory() {
  const t = "table { border-collapse: collapse; border: 1px solid black; width: 100%; } td, th { padding: 4px; } tr:nth-child(even) { background: #eee; } th { background: #eFe; }";

  const e = t => new Promise(e => {
    const n = new XMLHttpRequest;
    n.onload = (() => e(n.responseText));
    n.open("GET", t);
    n.send()
  });

  const n = t => Array.from(t.querySelectorAll("ol > li")).map(l);
  const r = (t, e) => t === null ? null : t[e];

  const a = t => {
    switch (t.innerText.trim()) {
      case "Unwrangleable":
        return "unwrangleable";
      case "Yes":
        return "yes";
      default:
        return "no"
      }
  };

  const o = t => t === null ? null : Array.from(t).map(t => t.innerHTML);

  const l = t => ({
    tag: t.querySelector("div > .header > .heading > a").innerHTML,
    taggings: t.querySelector("td[title='taggings']").innerHTML,
  });

  const c = t => t.querySelector("a[rel='next']");
  const s = t => new Promise(e => setTimeout(e, t));
  const i = t => `<tr><td>${t.tag}</td><td>${t.taggings}</td></tr>`;
  const d=()=>(new Date).getDay()===0;

  async function g(r) {
    if (d())return alert("Don't run this script on Sundays");
    let a = 1;const o = new DOMParser;
    const l = open();
    const g = l.document;
    g.write("<meta charset='utf-8'><table><tr>");
    g.write("<style>" + t + "</style>");
    g.write(["tag", "taggings"].map(t => `<th>${t}<th> `).join(""));
    g.write("</tr>");
    while (r !== null) {
      g.title =` ${a} pages deep `;
      a++;
      const t = o.parseFromString(await e(r), "text/html");
      g.write(n(t).map(i).join(""));
      const l = c(t);
      r = l ? l.href : null;
      await s(a < 1e3 ? 3e3 : 1e4)}g.write("</table>");
      g.title = "Done!";
      alert("Done!")}g(location.href)
}

funcion parseFic(id) {
  $("id .").
}
