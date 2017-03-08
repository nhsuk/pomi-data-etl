const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');
const constants = require('./constants');

const POMI_FILE = constants.POMI_FILE;
const POMI_DOWNLOAD_LOCATION = constants.POMI_DOWNLOAD_LOCATION;

function downloadFile() {
  return new Promise((resolve, reject) => {
    try {
      log.time('Downloading the POMI file took');
      resolve(
        apiRequest(POMI_DOWNLOAD_LOCATION)
        .then((data) => {
          log.timeEnd('Downloading the POMI file took');
          fsHelper.saveFileSync(data, POMI_FILE);
        }));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = downloadFile;
