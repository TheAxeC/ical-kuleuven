var schedule = require('node-schedule')

var gcal = require('./google_calendar')

// start scheduler
schedule.scheduleJob('35 0 * * *', gcal.createSchedule);
