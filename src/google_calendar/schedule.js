// Schedule a pass daily

var schedule = require('node-schedule')
var gcal = require('./google_calendar')

// start scheduler
gcal.createSchedule();
schedule.scheduleJob('0 * * * *', gcal.createSchedule);
