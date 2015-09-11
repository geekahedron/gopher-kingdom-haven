// ==UserScript==
// @name	GKH for Utopia
// @namespace	https://github.com/geekahedron/gopher-kingdom-haven/
// @version	0.0.3a
// @description	Auto-join script for 2015 Summer Steam Monster Minigame
// @author	geekahedron
// @match       http://utopia-game.com/wol/*
// @updateURL   https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @downloadURL https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @grant	none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==



window.onload = function() {
    insertInfoBox();
};

$(document).ready = function() {
};

var currentSection = window.location.pathname.split("/")[2];
var currentPage = window.location.pathname.split("/")[3];

var xmlhttp;
var content;

/**************************** 
 *    PAGE MANIPULATION     *
 ****************************/

function removeAds() {
    $("div#left-column").children()[0].remove();
    $("div#right-column").remove();
    $("div#middle").children()[$("div#middle").children().length-1].remove();
}

function showWanted() {
    
    $("div#middle div").hide();
    $("div#middle div").css('display','none');
    $("div#left-column").show();
    $("div#content-area").show();
    $("div#game-navigation").show();
    $("div#game-navigation div").show();
    $("div.game-header").show();
    $("div.game-content").show();
    $("div.game-content div").show();
}

function insertInfoBox() {
    var res = $("table#resource-bar");
    var infobox = document.createElement("div");
    infobox.id = "infobox";
    infobox.className = "infobox";
    var pagetitle = document.createElement("h2");
    pagetitle.innerHTML = getPageName(currentPage);
    infobox.appendChild(pagetitle);
    res.after(infobox);
}


/**************************** 
 *   PAGE READ FUNCTIONS    *
 ****************************/

function loadSpells() {
    getContent("council_spells", function(c) {
        content = c;
        var spelltable = content.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].children;
        for (var i = 0; i < spelltable.length; i++) {
            var spellrow = spelltable[i];
            var spelltype = spellrow.children[0].children[0].className;
            var spellname = spellrow.children[0].children[0].innerText.trim();
            var duration = spellrow.children[1].innerText.trim();
            var description = spellrow.children[2].innerText.trim();
            //! TODO::Display results on page
            console.log(spellname + " (" + spelltype + ") " + duration + " [" + description + "]");
        }
    });
}

function logKingdom(k, i) {
    getContent("kingdom_details/"+k+"/"+i, function(c) {
        var messages = c.getElementsByClassName("message")[0];
        var msg = "";
        if (messages && messages.length > 0) msg = messages.innerText.trim();
        if (msg === "The kingdom " + k + ":" + i + " could not be found!")
            console.log('Cannot load (' + k + ':' + i + '): Could not be found');
        else if (msg == "We have not yet discovered kingdoms on Island " + i) {
            console.log('Cannot load (' + k + ':' + i + '): Not yet discovered');
        } else {
            content = c;
            var provtable = c.getElementsByClassName("tablesorter")[0].children[1].children;
            for (var i = 0; i < provtable.length; i++) {
                var provrow = provtable[i];
                var provstatus = provrow.className;
                if (provstatus !== "unused-slot") {
                    var provname = provrow.children[1].children[0].innerText;
                    var provrace = provrow.children[2].innerText;
                    var provsize = provrow.children[3].innerText;
                    var provnw = provrow.children[4].innerText;
                    var provnwpa = provrow.children[5].innerText;
                    var provhonor = provrow.children[6].innerText;
                    //! TODO::Display results on page
                    console.log("[" + i + "]" +provhonor + " " + provname + ", " + provrace + ", " + provsize + ", " + provnw);
                }
            }
        }

    });
}

/**************************** 
 *   PAGE LOAD FUNCTIONS    *
 ****************************/

function loadXMLDoc(url,cfunc)
{
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=cfunc;
    console.log("loading " + url);
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

function parsePage(doc, cfunc) {
    console.log("parsing page");
    var htmlparse = new DOMParser();
    var contentStart = doc.search("<div class=\"game-content\">");
    var contentEnd = doc.search("<div id=\"right-column\">")
    content = htmlparse.parseFromString(doc.substr(contentStart,contentEnd-contentStart)+"</form></div>","text/html");
    var errors = content.children[0].children[0].innerHTML;
    if (errors.length === 0) { // No errors found
        cfunc(content.children[0].children[1].children[0]); // content div
    } else {
        console.log(errors);
    }
}

function getContent(page, cfunc) {
    if (page === currentPage) {
        console.log(getPageName(page) + " page is already loaded");
        parsePage(document.documentElement.innerHTML, cfunc);
    } else {
        var url = "/wol/game/" + page + "/";
        loadXMLDoc(url, function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                parsePage(xmlhttp.responseText, cfunc);
            }
        });
    }
}

/**************************** 
 *    UTILITY FUNCTIONS     *
 ****************************/

function getPageName(page) {
    var names = [];
    names["throne"] = "Throne";
    names["council_state"] = "Affairs of the State";
    names["council_military"] = "Military affairs";
    names["council_internal"] = "Buildings";
    names["council_learn"] = "Science";
    names["council_spells"] = "Mystics";
    names["council_history"] = "History";
    names["kingdom_details"] = "Kingdom";
    names["province news"] = "Province news";
    names["kingdom_news"] = "Kingdom news";
    names["explore"] = "Exploration";
    names["build"] = "Growth";
    names["raze"] = "Raze";
    names["science"] = "Science research";
    names["train_army"] = "Train army";
    names["release_army"] = "Release army";
    names["wizards"] = "Manage wizards";
    names["enchantment"] = "Self spells";
    names["sorcery"] = "Combat spells";
    names["thievery"] = "Thievery";
    names["send_armies"] = "War room";
    names["province_target_finder"] = "Potential targets";
    names["aid"] = "Send aid";
    names["vote"] = "Vote";
    names["war"] = "War";
    names["nap"] = "Ceasefire";
    names["conflict"] = "Relations";
    names["ranking"] = "Rankings";
    names["preferences"] = "Game preferences";
//    names[""] = "Change province details";
    names["vacation"] = "Vacation mode";
    names["sitting"] = "Province sitting";
//    names[""] = "Abandon province";
//    names[""] = "Random move";
    return names[page];
}
