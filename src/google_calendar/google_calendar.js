"use strict";

var fs = require('fs');
var google = require('googleapis');

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
			prepareNewCalendar(user, calendar, auth);
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
	let icalCreator = require('../ical/icalCreator');
	icalCreator.createSchedule(sendEvents);
}

function prepareNewCalendar(user, calendar, auth) {
	console.log('Deleting all events');
	deleteAllEvents(user, auth, function() {
		console.log('Adding all events');
		addAllEvents(user, calendar, auth);
	});
}

function addAllEvents(user, calendar, auth) {
	let events = calendar.events();
	let i = 0;
	console.log('Adding ' + events.length + ' items');
	for(let event of events) {
		let delay = i * 300;
		setTimeout(eventTimeout(user, event, auth, addEvent), delay);
		i += 1;
	}
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

function deleteAllEvents(user, auth, callback) {
	let calendar = google.calendar('v3');
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
		console.log('Deleting ' + events.length + ' items');
		for (let i = 0; i < events.length; i++) {
			let event = events[i];
			let delay = i * 300;
			setTimeout(eventTimeout(user, event, auth, deleteEvent), delay);
		}
		setTimeout(callback, (events.length+10)*300);
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

module.exports.createSchedule = createSchedule;
module.exports.registerToken = registerToken;



