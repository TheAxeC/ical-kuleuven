"use strict";

var fs = require('fs');
var google = require('googleapis');
var ical = require('ical');

var config = require('./config');
var authorize = require('./authorize');

function sendEvents(user, calendar) {
	if (!(user in config.CALENDAR_ID)) {
		console.log('User: ' + user + ' does not have a CALENDAR_ID');
		return;
	}
	// Load client secrets from a local file.
	fs.readFile(config.CLIENT_SECRET, function(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Calendar API.
		authorize.authorize(JSON.parse(content), function(auth) {
			HandleAllEvents(user, calendar, auth);
		});
	});
}

function registerToken() {
	// Load client secrets from a local file.
	fs.readFile(config.CLIENT_SECRET, function(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Calendar API.
		authorize.authorize(JSON.parse(content), function(auth) {});
	});
}

function createSchedule() {
	let icalCreator = require('../ical/ical_creator');
	icalCreator.createSchedule(sendEvents);
}

function eventTimeout(user, event, auth, func) {
	return function() {
		func(user, event, auth);
	}
}

function addEvent(user, event, auth) {
	let json = event.toJSON();
	let calendar = google.calendar('v3');
	calendar.events.insert({
		auth: auth,
		calendarId: config.CALENDAR_ID[user],
		resource: {
			'summary': json.summary,
			'location': json.location,
			'description': json.description,
			'start': {
				'dateTime': json.start,
			},
			'end': {
				'dateTime': json.end,
			}
		}
	}, function(err, response) {
		if (err) {
			console.log('The API (INSERT) returned an error: ' + err);
			return;
		}
	});
}

function HandleAllEvents(user, calendar_user, auth, callback) {
	let calendar = google.calendar('v3');
	console.log('Listing all events');
	calendar.events.list({
		auth: auth,
		calendarId: config.CALENDAR_ID[user],
		singleEvents: true,
		orderBy: 'startTime',
		maxResults: 1000
	}, function(err, response) {
		if (err) {
			console.log('The API (LIST EVENTS) returned an error: ' + err);
			return;
		}
		let events = response.items;

		let oldEvents = loadEventsFromFile(user);

		let deleteEvents = getEventsToDelete(events, oldEvents, calendar_user.events());
		let addEvents = getEventsToAdd(events, oldEvents, calendar_user.events());

		console.log("Need to delete: " + deleteEvents.length);
		console.log("Need to add: " + addEvents.length);

		let i = 0;
		for (let event of deleteEvents) {
			let delay = i * 300;
			setTimeout(eventTimeout(user, event, auth, deleteEvent), delay);
			i += 1;
		}
		for(let event of addEvents) {
			let delay = i * 300;
			setTimeout(eventTimeout(user, event, auth, addEvent), delay);
			i += 1;
		}
	});
}

function deleteEvent(user, event, auth) {
	let calendar = google.calendar('v3');
	calendar.events.delete({
		auth: auth,
		calendarId: config.CALENDAR_ID[user],
		eventId: event.id
	}, function(err, response) {
		if (err) {
			console.log('The API (DELETE) returned an error: ' + err);
			return;
		}
	});
}

function loadEventsFromFile(user) {
	let dir = __dirname + '/../../icals/';
	let data = ical.parseFile(dir + user + '-old.ics');
	let ret = [];
	for (var k in data){
		if (data.hasOwnProperty(k)) {
			try {
				let elem = {};
				let ev = data[k];
				elem['summary'] = ev.summary;
				elem['location'] = ev.location;
				elem['description'] = ev.description;
				elem['start'] = ev.start;
				elem['end'] = ev.end;
				if (elem['start'])
					ret.push(elem);
			} catch(err) {}
		}
	}
	return ret;
}

function compareGoogleAndEvent(ev1, ev2) {
	return ev1.summary == ev2.summary
			&& ev1.location == ev2.location
			&& ev1.description == ev2.description
			&& (new Date(ev1.start.dateTime)).getTime() == (new Date(ev2.start)).getTime()
			&& (new Date(ev1.end.dateTime)).getTime() == (new Date(ev2.end)).getTime();
}

function getEventsToDelete(google, old, newEvents) {
	// events in old and google, but not in new
	let ret = [];
	for(var ev_g of google) {
		let rem = false;
		for(var ev_o of old) {
			if (compareGoogleAndEvent(ev_g, ev_o)) {
				rem = true;
				break;
			}
		}
		if (rem) {
			for(var ev_n of newEvents) {
				let json = ev_n.toJSON();
				if (compareGoogleAndEvent(ev_g, json)) {
					rem = false;
					break;
				}
			}
		}

		if (rem) {
			ret.push(ev_g);
		}
	}
	return ret;
}

function getEventsToAdd(google, old, newEvents) {
	// events in new, but not in old and google
	let ret = [];
	for(var ev_n of newEvents) {
		let add = true;
		let json = ev_n.toJSON();
		for(var ev_g of google) {
			if (compareGoogleAndEvent(ev_g, json)) {
				add = false;
				break;
			}
		}
		//for(var ev_o of old) {}
		if (add) {
			ret.push(ev_n);
		}
	}
	return ret;
}

module.exports.createSchedule = createSchedule;
module.exports.registerToken = registerToken;
