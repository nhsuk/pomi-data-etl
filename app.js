const apiRequest = require('./app/lib/apiRequest');
const fsHelper = require('./app/lib/fsHelper');
const log = require('./app/lib/logger');

const downloadFile = apiRequest('https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv');

function handleError(err) {
  log.info(`processing failed: ${err}`);
}

function saveFile(data) {
  console.timeEnd('POMI-download');
  fsHelper.saveFileSync(data, 'pomi-data.csv');
}

console.time('POMI-download');

downloadFile
  .then(saveFile)
  .catch(handleError);

