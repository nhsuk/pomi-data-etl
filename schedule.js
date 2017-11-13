const schedule = require('node-schedule');

const etl = require('./etl');
const log = require('./app/lib/logger');
const scheduleConfig = require('./app/lib/scheduleConfig');

const scheduleToRun = scheduleConfig.getSchedule();
log.info({ schedule: scheduleToRun }, 'Scheduling job');
schedule.scheduleJob(scheduleToRun, () => {
  etl.start();
});
