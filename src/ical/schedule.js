var schedule = require('node-schedule')

var gcal = require('./ical_creator')

// start scheduler
gcal.createSchedule();
schedule.scheduleJob('0 * * * *', gcal.createSchedule);
