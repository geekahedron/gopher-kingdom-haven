// ==UserScript==
// @name	GKH for Utopia
// @namespace	https://github.com/geekahedron/gopher-kingdom-haven/
// @require http://code.jquery.com/jquery-latest.js
// @version	0.0.4a
// @description	Auto-join script for 2015 Summer Steam Monster Minigame
// @author	geekahedron
// @match       http://utopia-game.com/wol/*
// @updateURL   https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @downloadURL https://github.com/geekahedron/gopher-kingdom-haven/raw/master/gkh.user.js
// @grant	none
// ==/UserScript==

window.onload = function() {
    console.log("window loaded");
};

$(document).ready(function() {
    console.log("document ready");
    initialize();
});

var xmlhttp;
var state;
var spells;
var kingdoms;
var currentSection;
var currentPage;
var currentDate;
var currentMonth;
var currentDay;
var currentYear;
var prevDay;
var prevMonth;
var prevYear;

function initialize() {
    console.log("Initializing Gopher...");
    if (typeof localStorage['gopherstate'] === 'undefined') {
        state = [];
    } else {
        state = JSON.parse(localStorage['gopherstate']);
    }
    spells = [];
    kingdoms = [];
    
    currentSection = window.location.pathname.split("/")[2];
    currentPage = window.location.pathname.split("/")[3];
    currentDate = $("div.current-date")[0].innerText.split(" ");
    currentMonth = new Date(Date.parse(currentDate[0] +" 1, 2012")).getMonth()+1;
    currentDay = Number(currentDate[1].split(",")[0]);
    currentYear = Number(currentDate[2].substr(2));
    prevDay = currentDay - 1;
    prevMonth = currentMonth;
    prevYear = currentYear;
    if (prevDay === 0) {
        prevDay = 24;
        prevMonth -= 1;
    }
    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
    }
}


/**************************** 
 *    PAGE MANIPULATION     *
 ****************************/

function removeAds() {
    var adDiv = $("div#left-column > div:first-child");
    if (adDiv.attr("id") === undefined) adDiv.remove();
    $('#leaderboard-ad,#skyscraper-ad,#ad-words').remove();
    adDiv = $('#middle > div:last-child');
    if (adDiv.attr("id") === undefined) adDiv.remove();
}

function showWanted() {
    console.log("Showing wanted divs");
    addGlobalStyle('div#middle div { display:none; }');
    $("div#middle div").hide();
    $("div#middle div").css('display','none');
    $("div#left-column").show();
    $("div#content-area").show();
    $("div#game-navigation").show();
    $("div#game-navigation div").show();
    $("div.game-header").show();
    $("div.game-content").show();
    $("div.game-content div").show();
    $("div.infobox").show();
    $("div.infobox div").show();
}

function insertGopherBox() {
    removeAds();
    var gopherbox = document.createElement("div");
    gopherbox.id = "gopherbox";
    gopherbox.className = "gopherbox";
    var pagetitle = document.createElement("h2");
    pagetitle.innerHTML = "Gopher";
    gopherbox.appendChild(pagetitle);
    $("div#right-column")[0].appendChild(gopherbox);
}

/**************************** 
 *   PAGE READ FUNCTIONS    *
 ****************************/

function createChildArray(container, key) {
    if (typeof container[key] === 'undefined') {
        container[key] = [];
    }
}


function loadState() {
    getContent("council_state", function(c) {
        content = c;
        var statenumbers = c.children[2].children[1].children;
        var trendtable = c.children[4].children[1].children;

        createChildArray(state,'info');
        state.info.pezzies = statenumbers[0].children[1].innerText;
        state.info.employed = statenumbers[0].children[3].innerText;
        state.info.nw = statenumbers[0].children[5].innerText;
        state.info.army = statenumbers[1].children[1].innerText;
        state.info.unemployed = statenumbers[1].children[3].innerText;
        state.info.thieves = statenumbers[2].children[1].innerText;
        state.info.unfilledjobs = statenumbers[2].children[3].innerText;
        state.info.honor = statenumbers[2].children[5].innerText;
        state.info.wizzies = statenumbers[3].children[1].innerText;
        state.info.employment = statenumbers[3].children[3].innerText;
        state.info.landrank = statenumbers[3].children[5].innerText;
        state.info.population = statenumbers[4].children[1].innerText;
        state.info.income = statenumbers[4].children[3].innerText;
        state.info.nwrank = statenumbers[4].children[5].innerText;
        state.info.maxpop = statenumbers[5].children[1].innerText;
        state.info.wages = statenumbers[5].children[3].innerText;

        console.log("Current date: " + currentMonth + " " + currentDay + ", YR" + currentYear);
        
        console.log(1);
        createChildArray(state,'data');
        console.log(2);
        createChildArray(state.data,currentYear);
        console.log(3);
        createChildArray(state.data.currentYear,currentMonth);
        console.log(4);
        createChildArray(state.data.currentYear.currentMonth,currentDay);
        console.log(5);
        createChildArray(state.data,prevYear);
        console.log(6);
        createChildArray(state.data.prevYear,prevMonth);
        console.log(7);
        createChildArray(state.data.prevYear.prevMonth,prevDay);

        state.data[prevYear][prevMonth][prevday]["income"] = trendtable[0].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["wages"] = trendtable[1].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["draft"] = trendtable[2].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["science"] = trendtable[3].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["netgc"] = trendtable[4].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["pezchg"] = trendtable[5].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["fg"] = trendtable[6].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["fn"] = trendtable[7].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["fd"] = trendtable[8].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["netfood"] = trendtable[9].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["rd"] = trendtable[11].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["rp"] = trendtable[10].children[1].innerText;
        state.data[prevYear][prevMonth][prevday]["netrune"] = trendtable[12].children[1].innerText;

        state.data[currentYear][currentMonth]["income"] = trendtable[0].children[2].innerText;
        state.data[currentYear][currentMonth]["wages"] = trendtable[1].children[2].innerText;
        state.data[currentYear][currentMonth]["draft"] = trendtable[2].children[2].innerText;
        state.data[currentYear][currentMonth]["science"] = trendtable[3].children[2].innerText;
        state.data[currentYear][currentMonth]["netgc"] = trendtable[4].children[2].innerText;
        state.data[currentYear][currentMonth]["pezchg"] = trendtable[5].children[2].innerText;
        state.data[currentYear][currentMonth]["fg"] = trendtable[6].children[2].innerText;
        state.data[currentYear][currentMonth]["fn"] = trendtable[7].children[2].innerText;
        state.data[currentYear][currentMonth]["fd"] = trendtable[8].children[2].innerText;
        state.data[currentYear][currentMonth]["netfood"] = trendtable[9].children[2].innerText;
        state.data[currentYear][currentMonth]["rp"] = trendtable[10].children[2].innerText;
        state.data[currentYear][currentMonth]["rd"] = trendtable[11].children[2].innerText;
        state.data[currentYear][currentMonth]["netrune"] = trendtable[12].children[2].innerText;

        state.data[prevYear][prevMonth]["income"] = trendtable[0].children[3].innerText;
        state.data[prevYear][prevMonth]["wages"] = trendtable[1].children[3].innerText;
        state.data[prevYear][prevMonth]["draft"] = trendtable[2].children[3].innerText;
        state.data[prevYear][prevMonth]["science"] = trendtable[3].children[3].innerText;
        state.data[prevYear][prevMonth]["netgc"] = trendtable[4].children[3].innerText;
        state.data[prevYear][prevMonth]["pezchg"] = trendtable[5].children[3].innerText;
        state.data[prevYear][prevMonth]["fg"] = trendtable[6].children[3].innerText;
        state.data[prevYear][prevMonth]["fn"] = trendtable[7].children[3].innerText;
        state.data[prevYear][prevMonth]["fd"] = trendtable[8].children[3].innerText;
        state.data[prevYear][prevMonth]["netfood"] = trendtable[9].children[3].innerText;
        state.data[prevYear][prevMonth]["rp"] = trendtable[10].children[3].innerText;
        state.data[prevYear][prevMonth]["rd"] = trendtable[11].children[3].innerText;
        state.data[prevYear][prevMonth]["netrune"] = trendtable[12].children[3].innerText;
        
        localStorage['gopherState'] = JSON.stringify(state);
    });
}

function loadSpells() {
    getContent("council_spells", function(c) {
        content = c;
        var spelltable = c.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].children;
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

function parseContent(doc, cfunc) {
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
        parseContent(document.documentElement.innerHTML, cfunc);
    } else {
        var url = "/wol/game/" + page + "/";
        loadXMLDoc(url, function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                parseContent(xmlhttp.responseText, cfunc);
            }
        });
    }
}

/**************************** 
 *    UTILITY FUNCTIONS     *
 ****************************/

function getPageName(page) {
    var names = [];
    names.throne = "Throne";
    names.council_state = "Affairs of the State";
    names.council_military = "Military affairs";
    names.council_internal = "Buildings";
    names.council_learn = "Science";
    names.council_spells = "Mystics";
    names.council_history = "History";
    names.kingdom_details = "Kingdom";
    names.kingdom_intel = "Espionage";
    names.province_news = "Province news";
    names.kingdom_news = "Kingdom news";
    names.explore = "Exploration";
    names.build = "Growth";
    names.raze = "Raze";
    names.science = "Science research";
    names.train_army = "Train army";
    names.release_army = "Release army";
    names.wizards = "Manage wizards";
    names.enchantment = "Self spells";
    names.sorcery = "Combat spells";
    names.thievery = "Thievery";
    names.send_armies = "War room";
    names.province_target_finder = "Potential targets";
    names.aid = "Send aid";
    names.vote = "Vote";
    names.war = "War";
    names.nap = "Ceasefire";
    names.conflict = "Relations";
    names.ranking = "Rankings";
    names.preferences = "Game preferences";
//    names. = "Change province details";
    names.vacation = "Vacation mode";
    names.sitting = "Province sitting";
//    names. = "Abandon province";
//    names. = "Random move";
    return names[page];
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Why wait for the page to finish loading crap?
insertGopherBox();
