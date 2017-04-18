const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');
const constants = require('./constants');

function downloadFile(fileName, downloadLocation) {
  const timerMsg = `Downloading the ${fileName} file took`;
  log.time(timerMsg);

  return apiRequest(downloadLocation)
    .then((data) => {
      log.timeEnd(timerMsg);
      fsHelper.saveFileSync(data, fileName);
    });
}

function pomi() {
  const downloadLocation = constants.POMI.DOWNLOAD_LOCATION;
  return downloadFile('POMI', downloadLocation);
}

function scripts() {
  const downloadLocation = constants.SCRIPTS.DOWNLOAD_LOCATION;
  return downloadFile('SCRIPTS', downloadLocation);
}

module.exports = {
  pomi,
  scripts,
};
