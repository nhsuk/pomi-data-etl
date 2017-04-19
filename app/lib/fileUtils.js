function getReducedFileName(fileName) {
  return `${fileName.toLowerCase()}-reduced.csv`;
}

function getCurrentRecordsFileName(fileName) {
  return `${fileName.toLowerCase()}-current.csv`;
}

function getJsonFileName(fileName) {
  return `${fileName.toLowerCase()}.json`;
}

function getSimpleFileName(fileName) {
  return `${fileName.toLowerCase()}.csv`;
}

module.exports = {
  getCurrentRecordsFileName,
  getJsonFileName,
  getReducedFileName,
  getSimpleFileName,
};
