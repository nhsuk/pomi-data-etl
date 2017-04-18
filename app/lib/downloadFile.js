const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');
const constants = require('./constants');

const OUTPUT_DIR = constants.OUTPUT_DIR;
const POMI_CSV_FILE = constants.POMI.CSV_FILE;
const POMI_DOWNLOAD_LOCATION = constants.POMI.DOWNLOAD_LOCATION;

function pomi() {
  log.time('Downloading the POMI file took');
  return apiRequest(POMI_DOWNLOAD_LOCATION)
    .then((data) => {
      log.timeEnd('Downloading the POMI file took');
      fsHelper.saveFileSync(data, `${OUTPUT_DIR}/${POMI_CSV_FILE}`);
    });
}

module.exports = {
  pomi,
};
