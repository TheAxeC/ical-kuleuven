var schedule = require('node-schedule')

var gcal = require('./google_calendar')

// start scheduler
schedule.scheduleJob('59 23 * * *', gcal.createSchedule);