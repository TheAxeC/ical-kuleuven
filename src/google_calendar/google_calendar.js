var fs = require('fs');
var google = require('googleapis');

var config = require('./config');
var authorize = require('./authorize');

function sendEvents(calendar) {
	// Load client secrets from a local file.
	fs.readFile(config.CLIENT_SECRET, function(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Calendar API.
		authorize.authorize(JSON.parse(content), function(auth) {
			prepareNewCalendar(calendar, auth);
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
	var icalCreator = require('../ical/icalCreator');
	icalCreator.createSchedule(sendEvents);
}

function prepareNewCalendar(calendar, auth) {
	console.log('Deleting all events');
	deleteAllEvents(auth, function() {
		console.log('Adding all events');
		addAllEvents(calendar, auth);
	});
}

function addAllEvents(calendar, auth) {
	var events = calendar.events();
	i = 0;
	console.log('Adding ' + events.length + ' items');
	for(var event of events) {
		var delay = i * 350;
		setTimeout(eventTimeout(event, auth, addEvent), delay);
		i += 1;
	}
}

function eventTimeout(event, auth, func) {
	return function() {
		func(event, auth);
	}
}

function addEvent(event, auth) {
	var json = event.toJSON();
	var calendar = google.calendar('v3');
	calendar.events.insert({
		auth: auth,
		calendarId: config.CALENDAR_ID,
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

function deleteAllEvents(auth, callback) {
	var calendar = google.calendar('v3');
	calendar.events.list({
		auth: auth,
		calendarId: config.CALENDAR_ID,
		singleEvents: true,
		orderBy: 'startTime',
		maxResults: 1000
	}, function(err, response) {
		if (err) {
			console.log('The API (LIST EVENTS) returned an error: ' + err);
			return;
		}
		var events = response.items;
		console.log('Deleting ' + events.length + ' items');
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			var delay = i * 350;
			setTimeout(eventTimeout(event, auth, deleteEvent), delay);
		}
		setTimeout(callback, (events.length+10)*350);
	});
}

function deleteEvent(event, auth) {
	var calendar = google.calendar('v3');
	calendar.events.delete({
		auth: auth,
		calendarId: config.CALENDAR_ID,
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



