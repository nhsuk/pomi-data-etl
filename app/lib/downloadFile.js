const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');
const constants = require('./constants');

const OUTPUT_DIR = constants.OUTPUT_DIR;
const POMI_FILE = constants.POMI_FILE;
const POMI_DOWNLOAD_LOCATION = constants.POMI_DOWNLOAD_LOCATION;

function downloadFile() {
  log.time('Downloading the POMI file took');
  return apiRequest(POMI_DOWNLOAD_LOCATION)
    .then((data) => {
      log.timeEnd('Downloading the POMI file took');
      fsHelper.saveFileSync(data, `${OUTPUT_DIR}/${POMI_FILE}`);
    });
}

module.exports = downloadFile;
