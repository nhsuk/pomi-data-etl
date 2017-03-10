const fs = require('fs');
const csv = require('csv');
const log = require('./logger');
const constants = require('./constants');

const parse = csv.parse;

const OUTPUT_DIR = constants.OUTPUT_DIR;
const CURRENT_RECORDS_FILE = constants.CURRENT_RECORDS_FILE;

function convertToJson() {
  const csvReader =
    fs.createReadStream(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);

}

module.exports = convertToJson;
