const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');

const parse = csv.parse;
const transform = csv.transform;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const CURRENT_RECORDS_FILE = constants.CURRENT_RECORDS_FILE;
const JSON_FILE = constants.JSON_FILE;

function finishWritingJsonFile() {
  const fileSize = fs.statSync(`${OUTPUT_DIR}/${JSON_FILE}`).size;
  const pos = fileSize - 1; // account for final ','
  const fd = fs.openSync(`${OUTPUT_DIR}/${JSON_FILE}`, 'r+');
  fs.writeSync(fd, ']', pos, 'utf8');
}

function convertToJson() {
  return new Promise((resolve, reject) => {
    try {
      log.time('Converting CSV to JSON took');
      const csvReader =
        fs.createReadStream(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);
      const jsonWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${JSON_FILE}`);

      jsonWriter.write('[');

      csvReader
        .pipe(parse({ columns: true }))
        .pipe(transform(data => `${JSON.stringify(data)},`))
        .pipe(jsonWriter);

      jsonWriter.on('finish', () => {
        finishWritingJsonFile();
        log.timeEnd('Converting CSV to JSON took');
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = convertToJson;
