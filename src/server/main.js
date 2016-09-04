var schedule = require('node-schedule')

var config = require('../ical/config');
var icalCreator = require('../ical/icalCreator');
var server = require('./server')

// Create calender and start scheduler
icalCreator.createSchedule();
schedule.scheduleJob(config.cron, icalCreator.createSchedule);

// Start server to serve ical files
server.startServer();