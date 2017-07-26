const moment = require('moment');

const azureService = require('./azureService');
const fileUtils = require('./fileUtils');
const constants = require('./constants');
const log = require('./logger');

function getDateYYYYMMDD(date) {
  return moment(date).format('YYYYMMDD');
}

function getPrefix() {
  // prevent dev from over-writing production azure blob
  return process.env.NODE_ENV === 'production' ? '' : 'dev-';
}

function getTimeStampedName(outputName) {
  const name = `${outputName}-${getDateYYYYMMDD(new Date())}.json`;
  return `${getPrefix()}${name}`;
}

async function uploadOutputToAzure(containerName, filePath, outputName) {
  const name = `${getPrefix()}${outputName}.json`;
  log.info(`Overwriting '${name}' in Azure`);
  await azureService.uploadToAzure(containerName, filePath, name);

  const timeStampedName = getTimeStampedName(outputName);
  log.info(`Saving date stamped version '${timeStampedName}' in Azure`);
  return azureService.uploadToAzure(containerName, filePath, timeStampedName);
}

async function uploadOutput(type) {
  const outputName = type.toLowerCase();
  const filePath = `${constants.OUTPUT_DIR}/${fileUtils.getJsonFileName(type)}`;
  return uploadOutputToAzure(constants.CONTAINER_NAME, filePath, outputName);
}

module.exports = uploadOutput;
