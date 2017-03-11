const fs = require('fs');
const log = require('./logger');
const constants = require('./constants');

function getPath(filename) {
  return `${constants.OUTPUT_DIR}/${filename}`;
}

function createDirIfMissing(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function saveFileSync(content, filename) {
  createDirIfMissing(constants.OUTPUT_DIR);
  const path = getPath(filename);
  fs.writeFileSync(path, content, 'utf8');
  log.info(`${filename} saved`);
}

function loadFileSync(filename) {
  const path = getPath(filename);
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
}

module.exports = {
  saveFileSync,
  loadFileSync,
};
