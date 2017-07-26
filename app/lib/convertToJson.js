const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const fileUtils = require('./fileUtils');

const parse = csv.parse;
const transform = csv.transform;

function finishWritingJsonFile(fileName, outputDir) {
  const fileSize = fs.statSync(`${outputDir}/${fileUtils.getJsonFileName(fileName)}`).size;
  const pos = fileSize - 1; // account for final ','
  const fd = fs.openSync(`${outputDir}/${fileUtils.getJsonFileName(fileName)}`, 'r+');
  fs.writeSync(fd, ']', pos, 'utf8');
}

function convertToJson(data) {
  return new Promise((resolve, reject) => {
    try {
      const outputDir = data.request.OUTPUT_DIR;
      const fileType = data.request.type;
      const timerMsg = `Converting CSV to JSON for ${fileType} took`;
      log.time(timerMsg);
      const csvReader =
        fs.createReadStream(`${outputDir}/${fileUtils.getCurrentRecordsFileName(fileType)}`);
      const jsonWriter =
        fs.createWriteStream(`${outputDir}/${fileUtils.getJsonFileName(fileType)}`);

      jsonWriter.write('[');

      csvReader
        .pipe(parse({ columns: true }))
        .pipe(transform(parsedData => `${JSON.stringify(parsedData)},`))
        .pipe(jsonWriter);

      jsonWriter.on('finish', () => {
        finishWritingJsonFile(fileType, outputDir);
        log.timeEnd(timerMsg);
        resolve(true);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

module.exports = convertToJson;
