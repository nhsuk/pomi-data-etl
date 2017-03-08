function createDate(date) {
  // date format is dd/mm/yyyy
  const splitDate = date.split('/');
  return new Date(splitDate[2], splitDate[1], splitDate[0]);
}

function getMostRecentPeriod(periodSet) {
  return [...periodSet]
    .sort((date1, date2) => createDate(date2) - createDate(date1))
    .shift();
}

module.exports = {
  getMostRecentPeriod,
};
