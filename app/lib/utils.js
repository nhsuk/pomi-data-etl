const constants = require('../../app/lib/constants');

const PERIOD_END_HEADER = constants.BOOKING.HEADERS.PERIOD_END;

function removeHeaderFromPeriods(periodSet) {
  const periods = [...periodSet];
  const indexOfHeader = periods.indexOf(PERIOD_END_HEADER);
  periods.splice(indexOfHeader, 1);
  return periods;
}

function createDate(date) {
  // date format is dd/mm/yyyy
  const splitDate = date.split('/');
  return new Date(splitDate[2], splitDate[1], splitDate[0]);
}

function getMostRecentPeriod(periodSet) {
  return removeHeaderFromPeriods(periodSet)
    .sort((date1, date2) => createDate(date2) - createDate(date1))
    .shift();
}

module.exports = {
  getMostRecentPeriod,
};
