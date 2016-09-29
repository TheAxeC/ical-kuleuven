var schedule = require('node-schedule')

var gcal = require('./icalCreator')

// start scheduler
gcal.createSchedule();
schedule.scheduleJob('0 * * * *', gcal.createSchedule);
