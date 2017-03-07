const apiRequest = require('./app/lib/apiRequest');
const fsHelper = require('./app/lib/fsHelper');
const logger = require('./app/lib/logger');

const download = apiRequest('https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv');

function handleError(err) {
  log.info(`processing failed: ${err}`);
}

console.time('POMI-download');

download
  .then((data) => {
    console.timeEnd('POMI-download');
    fsHelper.saveFileSync(data, 'pomi-data.csv'); })
  .catch(handleError);

