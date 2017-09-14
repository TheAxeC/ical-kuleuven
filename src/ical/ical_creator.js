"use strict";

let fs = require('fs');
let Horseman = require('node-horseman');
let jsdom = require("jsdom");
let ical = require('ical-generator');

let config = require('./config');

// Main entry point
// Load all pages from the website
function loadPages(parsingCallback, callback) {
	console.log('icalCreator:loadPages : loading all pages');
	let pages = getPagesList();
	//console.log('icalCreator:loadPages : page list: ' + JSON.stringify(pages));
	requestHandler(pages, parsingCallback, {}, callback);
}

// Requesthandler: load each url in a synchronous way
function requestHandler(urls, parsingCallback, htmlMap, callback) {
	console.log('icalCreator:requestHandler : remaining length: ' + Object.keys(urls).length);
	if (Object.keys(urls).length == 0) {
		parsingCallback(htmlMap, callback);
	} else {
		let firstKey = Object.keys(urls)[0];
		requestPage(firstKey, urls[firstKey], firstKey, function(html) {
			htmlMap[firstKey] = html;
			delete urls[firstKey];
			requestHandler(urls, parsingCallback, htmlMap, callback);
		});
	}
}

// Get a list of all urls
function getPagesList() {
	console.log('icalCreator:getPagesList : list all urls');
	let pages = {}
	for(let key in config.users) {
		let courses = config.users[key];
		for(let key in courses) {
			let url = 'http://www.kuleuven.be/sapredir/uurrooster/keuze_studiejaar.htm'
			 			+ '?TAAL=N&'
						+ 'OBJID_SC=' + key.split('-')[0] + '&'
						+ 'SEL_JAAR=' + key.split('-')[1] + '&'
						+ 'STUDIEJAAR=' + key.split('-')[2];
			pages[key] = url;
		}
	}
	return pages;
}


// Using node-horseman and phantomjs to load a page
function requestPage(key, url, params, callback) {
	console.log('icalCreator:requestPage : key ' + key + ' : requesting page ' + url);

	if (canUseFile(params)) {
		console.log('icalCreator:requestPage:horseman : loaded page through FILE');
		readFile(getFileName(__dirname + '/../../html/' + params), function(page) {
			callback(page);
		});
		return;
	}

	let horseman = new Horseman({
        timeout: 100000
    });

	if (params.split('-')[3] != config.current_semester) {
		console.log('icalCreator:requestPage:horseman : not current semester');
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
			writeFile(__dirname + '/../../html/' + params, page);
			callback(page);
		}).close();
	} else {
		console.log('icalCreator:requestPage:horseman : current semester');
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
			writeFile(__dirname + '/../../html/' + params, page);
			callback(page);
		}).close();
	}

}

// Check if a file exists and whether it is not too old (1 day)
function canUseFile(params) {
	let dir = __dirname + '/../../html/';
	let filename = getFileName(dir + params);
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	if (!fs.existsSync(filename))
		return false;

	let stats = fs.statSync(filename);

	let now = new Date().getTime();
	let endTime = new Date(stats.ctime).getTime() + (1000*60*60*24);
	return endTime > now;
}

// rename file to old
function renameFile(user) {
	let dir = __dirname + '/../../icals/';
	let filename = dir + user + '.ics';
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	if (!fs.existsSync(filename))
		return;

	fs.renameSync(dir + user + '.ics', dir + user + '-old.ics');
}

// Write data to file
function writeFile(params, data) {
	let url = getFileName(params);
	return fs.writeFileSync(url, data);
}

// read a file and call a callback
function readFile(filename, callback) {
	fs.readFile(filename, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		callback(data);
	});
}

// get a html file name
function getFileName(params) {
	return params + '.html';
}

// Parse all users
function parseUsers(htmlMap, callback) {
	console.log();
	console.log('icalCreator:parseUsers : Parsing all users');
	let i = 0;
	for(let key in config.users) {
		setTimeout(parseSingleUser, 10000*i, key, config.users[key], htmlMap, callback);
		i += 1;
	}
}

// Parse a single user
function parseSingleUser(user, courses, htmlMap, callback) {
	let len = Object.keys(courses).length;
	console.log();
	console.log('icalCreator:parseSingleUser : Parsing user "' + user + '" ' + len);

	let calender = ical({
	        name: 'KULeuven - courses',
	        timezone: 'Europe/Brussels'
	    });
	calender.ttl(60*60);
	calender.prodId('//AxelFaes//KULeuven_personal_calendar//EN');
	calender.method('publish');

	parseHandler(user, Object.keys(courses), htmlMap, courses, calender, function() {
		let dir = __dirname + '/../../icals/';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		console.log('icalCreator:parseSingleUser : User "' + user + '" has ' + calender.events().length + ' events');
		renameFile(user);
		calender.save(dir + user + '.ics');
		callback(user, calender);
		if (global.gc) {
    		global.gc();
		} else {
    		console.log('Garbage collection unavailable.  Pass --expose-gc '
     					 + 'when launching node to enable forced garbage collection.');
		}
	});
}

// Requesthandler: load each url in a synchronous way
function parseHandler(user, keys, htmlMap, courses, calender, parsingCallback) {
	console.log('icalCreator:parseHandler : remaining length: ' + keys.length);
	if (keys.length == 0) {
		parsingCallback(htmlMap);
	} else {
		let firstKey = keys[0];
		keys.shift();
		parsePage(user, firstKey, htmlMap[firstKey], courses[firstKey], calender, function() {
			parseHandler(user, keys, htmlMap, courses, calender, parsingCallback);
		});
	}
}

// Parse html page
function parsePage(user, pageID, page, courses, calender, callback) {
	console.log('icalCreator:parsePage : starting to parse page: ' + pageID);

	jsdom.env({
		html : page,
		scripts : [__dirname + "/jquery/jquery.js"],
		done : function (err, window) {
			for(let c of courses) {
				// Find the element
				window.$.extend(window.$.expr[':'], {
					'containsi': function(elem, i, match, array)
					{
						return (elem.textContent || elem.innerText || '').toLowerCase()
							.indexOf((match[3] || "").toLowerCase()) >= 0;
					}
				});
				let courseIDList = window.$('a:containsi("' + c + '")');
				let year = (pageID.split('-')[3] == '2') ? (parseInt(pageID.split('-')[1])+1) : pageID.split('-')[1];
				console.log('icalCreator:parsePage : found courseID ' + c + ' ' + courseIDList.length);
				if (courseIDList.length == 1) parseSingle(user, c, year, courseIDList, calender, window);
				else {
					courseIDList.each(function(courseID) {
						parseSingle(user, c, year, window.$(this), calender, window);
					});
				}
			}
			console.log('icalCreator:parsePage : end parse page: ' + pageID);
			callback();
		}
	});
}

// Parse a single event
function parseSingle(user, c, year, courseID, calender, window) {
	// a -> td -> tr -> tbody -> table
	let table = courseID.parent().parent().parent().parent();
	let dates = table.next().children().children().children();

	// print course information
	let siblings = courseID.parent().siblings();

	let time = window.$(siblings[1]).text().trim();
	let description = window.$(siblings[2]).text().trim();
	let name = window.$(siblings[3]).text().trim();
	let prof = window.$(siblings[4]).text().trim();

	if (!allowEvent(user, c, name)) {
		return;
	}

	let dateList = [];
	for(let i=0; i<dates.length; i++) {
		let txt = window.$(dates[i]).text().trim();
		if (txt)
			dateList.push(txt);
	}

	// Making ICAL format
	for(let i=0; i<dateList.length; i++) {
		let d = dateList[i];
		let day = parseInt(d.split('.')[0]);
		let month = parseInt(d.split('.')[1]);
		let begin = time.split(' tot ')[0];
		let end = time.split(' tot ')[1];

		let beginHour = parseInt(begin.split(':')[0]);
		let beginMin = parseInt(begin.split(':')[1]);
		let endHour = parseInt(end.split(':')[0]);
		let endMin = parseInt(end.split(':')[1]);

		let startDate = new Date(year, month-1, day, beginHour, beginMin, 0, 0);
		let endDate = new Date(year, month-1, day, endHour, endMin, 0, 0);

		calender.createEvent({
			start: startDate,
			end: endDate,
			summary: name,
			location: description,
			description: "courseID: " + c + "\n" + prof
		});
	}
}

// Check if an event is allowed using the config.group_list
function allowEvent(user, courseID, eventName) {
	courseID = courseID.toUpperCase();
	if (user in config.group_list) {
		//console.log('User found in group list')
		let user_group_list = config.group_list[user];
		if (courseID in user_group_list) {
			//console.log('CourseID found in User group list')
			return eventName.includes(user_group_list[courseID])
		}
	}
	return true;
}

// Main function
module.exports.createSchedule = function(callback) {
	console.log('-----------------------------------------------------------------------');
	console.log(new Date());
	console.log();
	if (!callback) {
		loadPages(parseUsers, function(user, calendar) {});
	} else {
		loadPages(parseUsers, callback);
	}
}
