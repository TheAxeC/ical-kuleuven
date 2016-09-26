# ical-kuleuven

An nodejs application to create an iCalendar file for KULeuven (University of Leuven).

Dependencies can be installed by running ` npm install ` from the root directory.

Creating the ical file can be done by running:
``` node src/ical/create_ical.js ```

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