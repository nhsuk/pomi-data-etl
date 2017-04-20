const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');

function downloadFile(request) {
  const fileName = request.type;
  const timerMsg = `Downloading the ${fileName} file took`;
  log.time(timerMsg);

  return apiRequest(request)
    .then((data) => {
      log.timeEnd(timerMsg);
      fsHelper.saveFileSync(data);
      return request;
    });
}

module.exports = downloadFile;
