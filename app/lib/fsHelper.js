const fs = require('fs');
const log = require('./logger');

function createDirIfMissing(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function saveFileSync(content, path) {
  createDirIfMissing(path.split('/')[0]);
  fs.writeFileSync(path, content, 'utf8');
  log.info(`${path} saved`);
}

module.exports = {
  saveFileSync,
};

