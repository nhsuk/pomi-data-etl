const fs = require('fs');
const log = require('./logger');
const fileUtils = require('./fileUtils');
const constants = require('./constants');

function createDirIfMissing(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function saveFileSync(data, outputDir = constants.OUTPUT_DIR) {
  const fileName = data.request.type;
  const path = `${outputDir}/${fileUtils.getSimpleFileName(fileName)}`;
  createDirIfMissing(path.split('/')[0]);
  fs.writeFileSync(path, data.body, 'utf8');
  log.info(`${path} saved`);
}

module.exports = {
  saveFileSync,
};
