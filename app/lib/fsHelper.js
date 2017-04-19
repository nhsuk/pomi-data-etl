const fs = require('fs');
const log = require('./logger');
const fileUtils = require('./fileUtils');
const constants = require('./constants');

function createDirIfMissing(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function saveFileSync(content, fileName, outputDir = constants.OUTPUT_DIR) {
  const path = `${outputDir}/${fileUtils.getSimpleFileName(fileName)}`;
  createDirIfMissing(path.split('/')[0]);
  fs.writeFileSync(path, content, 'utf8');
  log.info(`${path} saved`);
}

module.exports = {
  saveFileSync,
};
