// ==UserScript==
// @name	GKH for Utopia
// @namespace	https://github.com/geekahedron/gopher-kingdom-haven/
// @version	0.0.1a
// @description	Auto-join script for 2015 Summer Steam Monster Minigame
// @author	geekahedron
// @match       http://utopia-game.com/wol/*
// @updateURL   https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @downloadURL https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @grant	none
// ==/UserScript==

console.log(window.location.pathname);


window.onload = function() {
    removeTopAd();
    logKingdom(1,1);
};

function removeTopAd() {
    document.getElementById("left-column").children[0].remove()
}

function logKingdom(k, i) {
    
    var xmlhttp;
    var htmlparse = new DOMParser();
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var doc = xmlhttp.responseText;
            var provtable = doc.substr(doc.search('<table class="tablesorter">'));
            provtable = provtable.substr(0,provtable.search('</table>')+8);
            var kdtable = doc.substr(doc.search('<table class="two-column-stats">'));
            kdtable = kdtable.substr(0,kdtable.search('</table>')+8);
            var kdnamediv = doc.substr(doc.search('<div class="change-kingdom-heading">'));
            kdnamediv = kdnamediv.substr(0,kdnamediv.search('</a>'));
            provs = htmlparse.parseFromString(provtable,"text/xml");
            kingdom = htmlparse.parseFromString(kdtable,"text/xml");
            kdname = kdnamediv.substr(kdnamediv.search('Current kingdom is ')+19);
            kdname = kdname.substr(0,kdname.search('<a href')-2);
            kdloc = kdnamediv.substr(kdnamediv.length-8);
            kdloc = kdloc.substr(kdloc.search('">')+2);
        }
    }
    var str = "/wol/game/kingdom_details/"+k+"/"+i;
    console.log("opening " + str);
    xmlhttp.open("GET", str, true);
    xmlhttp.send();
}

