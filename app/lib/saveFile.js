const fs = require('fs');
const log = require('./logger');
const apiRequest = require('./apiRequest');
const fsHelper = require('./fsHelper');

function saveFile(request) {
  const fileName = request.type;
  const timerMsg = `Downloading the ${fileName} file took`;
  log.time(timerMsg);

  if (request.path) {
    const data = fs.readFileSync(request.path);
    log.timeEnd(timerMsg);
    fsHelper.saveFileSync({ body: data, request }, request.OUTPUT_DIR);
    return request;
  }

  return apiRequest(request)
    .then((data) => {
      log.timeEnd(timerMsg);
      fsHelper.saveFileSync(data);
      return request;
    });
}

module.exports = saveFile;
