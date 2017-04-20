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

function convertToJson(data) {
  return new Promise((resolve, reject) => {
    const fileType = data.request.type;
    const timerMsg = `Converting CSV to JSON for ${fileType} took`;
    try {
      log.time(timerMsg);
      const csvReader =
        fs.createReadStream(`${OUTPUT_DIR}/${fileUtils.getCurrentRecordsFileName(fileType)}`);
      const jsonWriter =
        fs.createWriteStream(`${OUTPUT_DIR}/${fileUtils.getJsonFileName(fileType)}`);

      jsonWriter.write('[');

      csvReader
        .pipe(parse({ columns: true }))
        .pipe(transform(parsedData => `${JSON.stringify(parsedData)},`))
        .pipe(jsonWriter);

      jsonWriter.on('finish', () => {
        finishWritingJsonFile(fileType);
        log.timeEnd(timerMsg);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = convertToJson;
