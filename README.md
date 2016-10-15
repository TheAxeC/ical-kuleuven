# ical-kuleuven

An nodejs application to create an iCalendar file for KULeuven (University of Leuven).

## Dependencies
Dependencies can be installed by running ` npm install ` from the root directory.

## Running
Creating the ical file can be done by running:
``` node src/ical/create.js ```

It is possible to use the google API to immediately insert events.
This can be done by running:
``` node src/google_calendar/create.js ```

This can be put in a scheduler by running:
``` node src/google_calendar/schedule.js ```

In order to run the `google_calendar.js` script, the following are required:
- [client_secret.json](https://developers.google.com/google-apps/calendar/quickstart/nodejs)
	* location: src/google_calendar/secrets/
- token.json
	* location: src/google_calendar/secrets/
	* generate: by running `node src/google_calendar/register.js` and following the instruction
- setting the calendar ID in `src/google_calendar/config.js`
	* ID can be found in calendar.google.com in calendar details

## Config (src/ical/config.js)
### Course list
The following structure is used:
```
'user' : {
	'objectid-year-phase-semester' : ['courseID'],
},
```
'user' is the username that is used to identify the courselist. The created ical file is also named: 'user.ics'.

'objectid' is the ID of the bachelor or master program.

'year' is the year from which you want to extract the schedule.

'phase' is the phase of the program. Bachelors have 3 phases, most masters have 2 phases.

'semester' is the semester in which the course is given.

### Group list

## Google calendar integration
Google calendar can be used with this application. The application syncs with the google calendar checks which events are outdated or need to be newly added and makes those changes.
