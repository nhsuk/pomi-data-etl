const requireEnv = require('require-environment-variables');
// requireEnvs must be at the top of the file as the azure-storage module uses the
// AZURE_STORAGE_CONNECTION_STRING variable on load
requireEnv(['AZURE_STORAGE_CONNECTION_STRING']);

const downloadAndProcessFile = require('./app/lib/downloadAndProcessFile');
const uploadOutputToAzure = require('./app/lib/uploadOutputToAzure');

const bookingDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv';
const scriptsDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/ORDER_REPEAT_PRESCRIPTIONS_POMI.csv';
const codedRecordsDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/DETAILED_CODED_RECORDS_POMI.csv';

async function start() {
  const downloads = [
    { type: 'BOOKING', url: bookingDownloadUrl },
    { type: 'SCRIPTS', url: scriptsDownloadUrl },
    { type: 'RECORDS', url: codedRecordsDownloadUrl },
  ];

  for (const download of downloads) {
    // await downloadAndProcessFile(download);
    await uploadOutputToAzure(download.type);
  }
}
module.exports = { start };
