const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;

const OUTPUT_DIR = constants.OUTPUT_DIR;

function finishWritingJsonFile(fileName) {
  const fileSize = fs.statSync(`${OUTPUT_DIR}/${fileUtils.getJsonFileName(fileName)}`).size;
  const pos = fileSize - 1; // account for final ','
  const fd = fs.openSync(`${OUTPUT_DIR}/${fileUtils.getJsonFileName(fileName)}`, 'r+');
  fs.writeSync(fd, ']', pos, 'utf8');
}

function convertToJson(fileName) {
  return new Promise((resolve, reject) => {
    const timerMsg = `Converting CSV to JSON for ${fileName} took`;
    try {
      log.time(timerMsg);
      const csvReader =
        fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getCurrentRecordsFileName(fileName)}`);
      const jsonWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getJsonFileName(fileName)}`);

      jsonWriter.write('[');

      csvReader
        .pipe(parse({ columns: true }))
        .pipe(transform(data => `${JSON.stringify(data)},`))
        .pipe(jsonWriter);

      jsonWriter.on('finish', () => {
        finishWritingJsonFile(fileName);
        log.timeEnd(timerMsg);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

function pomi() {
  return convertToJson('POMI');
}

function scripts() {
  return convertToJson('SCRIPTS');
}

module.exports = {
  pomi,
  scripts,
};
