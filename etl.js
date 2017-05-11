const downloadAndProcessFile = require('./app/lib/downloadAndProcessFile');

const bookingDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv';
const scriptsDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/ORDER_REPEAT_PRESCRIPTIONS_POMI.csv';
const codedRecordsDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/DETAILED_CODED_RECORDS_POMI.csv';

function start() {
  const downloads = [
    { type: 'BOOKING', url: bookingDownloadUrl },
    { type: 'SCRIPTS', url: scriptsDownloadUrl },
    { type: 'RECORDS', url: codedRecordsDownloadUrl },
  ];

  downloads.forEach((request) => {
    downloadAndProcessFile(request);
  });
}
module.exports = start;
