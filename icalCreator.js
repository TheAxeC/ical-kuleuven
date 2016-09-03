var fs = require('fs');
var Horseman = require('node-horseman');
var jsdom = require("jsdom");
var ical = require('ical-generator');

var config = require('./config');

// Main entry point
// Load all pages from the website
function loadPages(parsingCallback) {
	console.log('icalCreator:loadPages : loading all pages');
	var pages = getPagesList();
	console.log('icalCreator:loadPages : page list: ' + JSON.stringify(pages));
	requestHandler(pages, parsingCallback, {});
}

// Requesthandler: load each url in a synchronous way
function requestHandler(urls, parsingCallback, htmlMap) {
	console.log('icalCreator:requestHandler : remaining length: ' + Object.keys(urls).length);
	if (Object.keys(urls).length == 0) {
		parsingCallback(htmlMap);
	} else {
		var firstKey = Object.keys(urls)[0];
		requestPage(urls[firstKey], firstKey, function(html) {
			htmlMap[firstKey] = html;
			delete urls[firstKey];
			requestHandler(urls, parsingCallback, htmlMap);
		});
	}
}

// Get a list of all urls
function getPagesList() {
	console.log('icalCreator:getPagesList : list all urls');
	var pages = {}
	for(var key in config.users) {
		var courses = config.users[key];
		for(var key in courses) {
			var url = config.url + '?TAAL=N&' + config.id_url + key.split('-')[0] + '&'
										+ config.year_url + key.split('-')[1] + '&'
										+ config.phase_url + key.split('-')[2];
			pages[key] = url;
		}
	}
	return pages;
}


// Using node-horseman and phantomjs to load a page
function requestPage(url, params, callback) {
	console.log('icalCreator:requestPage : requesting page ' + url);

	if (canUseFile(params)) {
		console.log('icalCreator:requestPage:horseman : loaded page through FILE');
		readFile(getFileName('html/' + params), function(page) {
			callback(page);
		});
		return;
	}

	var horseman = new Horseman({
        timeout: 100000
    });

    if (params.split('-')[3] == '2') {
		horseman
	    .open(url)
	    .status()
	    .evaluate(function() { Laden(); })
	    .waitForNextPage()
	    .click('a[href="javascript:semester()"]')
	    .waitForNextPage()
	    .evaluate(function() { Laden(); })
	    .waitForNextPage()
		.evaluate(function() { document.continueform.submit(); })
	    .waitForNextPage()
	    .click('a[href="javascript:semester(\'' + params.split('-')[3] + '\');"]')
	    .waitForNextPage()
	    .evaluate(function() { Laden(); })
	    .waitForNextPage()
		.evaluate(function() { document.continueform.submit(); })
	    .waitForNextPage()
		.html()
	    .then(function (page) {
	        // We retrieved the page correctly
	        // Now we need to parse the page
	        console.log('icalCreator:requestPage:horseman : loaded page through HTTP');
	        //parsePage(page, courses);
	        writeFile('html/' + params, page);
	        callback(page);
	    }).close();
    } else {
		horseman
	    .open(url)
	    .status()
	    .evaluate(function() { Laden(); })
	    .waitForNextPage()
	    .click('a[href="javascript:semester()"]')
	    .waitForNextPage()
	    .evaluate(function() { Laden(); })
	    .waitForNextPage()
		.evaluate(function() { document.continueform.submit(); })
	    .waitForNextPage()
		.html()
	    .then(function (page) {
	        // We retrieved the page correctly
	        // Now we need to parse the page
	        console.log('icalCreator:requestPage:horseman : loaded page through HTTP');
	        //parsePage(page, courses);
	        writeFile('html/' + params, page);
	        callback(page);
	    }).close();
    }
	
}

function canUseFile(params) {
	var filename = getFileName('html/' + params);
	//return fs.existsSync(filename);
	
	var stats = fs.statSync(filename);

	var now = new Date().getTime();
	var endTime = new Date(stats.ctime).getTime() + (1000*60*60*24);
	return endTime > now;
}

function writeFile(params, data) {
	url = getFileName(params);
	fs.writeFile(url, data, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file \"" + url + "\" was saved!");
	}); 
}

function readFile(filename, callback) {
	fs.readFile(filename, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		callback(data);
	});
}

function getFileName(params) {
	var filename = params;
	//var d = new Date();
	//filename += '_' + d.getUTCDate() + '_' + d.getUTCMonth() 
	filename += '.html';
	return filename;
}

function parseUsers(htmlMap) {
	console.log();
	console.log('icalCreator:parseUsers : Parsing all users');
	for(var key in config.users) {
		parseSingleUser(key, config.users[key], htmlMap);
	}
}

function parseSingleUser(user, courses, htmlMap) {
	var len = Object.keys(courses).length;
	console.log('icalCreator:parseSingleUser : Parsing user "' + user + '" ' + len);

	var calender = ical({
	        name: 'KULeuven - courses',
	        timezone: 'Europe/Brussels'
	    });
	calender.ttl(config.ttl_ical);
	calender.prodId('//AxelFaes//KULeuven_personal_calendar//EN');

// new_ical["CALSCALE"] = "GREGORIAN"
// new_ical["X-PUBLISHED-TTL"] = "PT1H"  # Update interval.

	parseHandler(Object.keys(courses), htmlMap, courses, calender, function() {
		calender.save('icals/' + user + '.ics');
	});
}

// Requesthandler: load each url in a synchronous way
function parseHandler(keys, htmlMap, courses, calender, parsingCallback) {
	console.log('icalCreator:parseHandler : remaining length: ' + keys.length);
	if (keys.length == 0) {
		parsingCallback(htmlMap);
	} else {
		var firstKey = keys[0];
		keys.shift();
		parsePage(firstKey, htmlMap[firstKey], courses[firstKey], calender, function() {
			parseHandler(keys, htmlMap, courses, calender, parsingCallback);
		});
	}
}

function parsePage(pageID, page, courses, calender, callback) {
	console.log('icalCreator:parsePage : starting to parse page: ' + pageID);
	
	jsdom.env({
		html : page,
		scripts : ["jquery.js"],
		done : function (err, window) {
			for(var c of courses) {
				// Find the element
				window.$.extend(window.$.expr[':'], {
					'containsi': function(elem, i, match, array)
					{
						return (elem.textContent || elem.innerText || '').toLowerCase()
							.indexOf((match[3] || "").toLowerCase()) >= 0;
					}
				});
				var courseIDList = window.$('a:containsi("' + c + '")');
				var year = (pageID.split('-')[3] == '2') ? (parseInt(pageID.split('-')[1])+1) : pageID.split('-')[1];
				console.log('icalCreator:parsePage : found courseID ' + c + ' ' + courseIDList.length);
				if (courseIDList.length == 1) parseSingle(c, year, courseIDList, calender, window);		
				else {
					courseIDList.each(function(courseID) {
						parseSingle(c, year, window.$(this), calender, window);					
					});
				}				
			}
			console.log('icalCreator:parsePage : end parse page: ' + pageID);
			callback();
		}
	});
}

function parseSingle(c, year, courseID, calender, window) {
	// a -> td -> tr -> tbody -> table
	var table = courseID.parent().parent().parent().parent();
	var dates = table.next().children().children().children();

	// print course information
	var siblings = courseID.parent().siblings();

	var time = window.$(siblings[1]).text().trim();
	var description = window.$(siblings[2]).text().trim();
	var name = window.$(siblings[3]).text().trim();
	var prof = window.$(siblings[4]).text().trim();

	var dateList = [];
	for(var i=0; i<dates.length; i++) {
		var txt = window.$(dates[i]).text().trim();
		if (txt)
			dateList.push(txt);
	}

	// Making ICAL format
	for(var i=0; i<dateList.length; i++) {
		var d = dateList[i];
		var day = parseInt(d.split('.')[0]);
		var month = parseInt(d.split('.')[1]);
		var begin = time.split(' tot ')[0];
		var end = time.split(' tot ')[1];

		var beginHour = parseInt(begin.split(':')[0]);
		var beginMin = parseInt(begin.split(':')[1]);
		var endHour = parseInt(end.split(':')[0]);
		var endMin = parseInt(end.split(':')[1]);

		var start = new Date(year, month-1, day, beginHour, beginMin, 0, 0);
		var end = new Date(year, month-1, day, endHour, endMin, 0, 0);

		//console.log('icalCreator:parsePage : Adding event: ' + c + ' ' + i);
		calender.createEvent({
			start: start,
			end: end,
			summary: name,
			description: description + '\n\n' + prof
		});
	}
}

module.exports.createSchedule = function() {
	loadPages(parseUsers);
}

