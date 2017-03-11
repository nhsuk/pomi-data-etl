function info(message) {
  // eslint-disable-next-line no-console
  console.log(message);
}

function error(message, err) {
  // eslint-disable-next-line no-console
  console.error(message, err);
}

function time(message) {
  // eslint-disable-next-line no-console
  console.time(message);
}

function timeEnd(message) {
  // eslint-disable-next-line no-console
  console.timeEnd(message);
}

module.exports = {
  info,
  error,
  time,
  timeEnd,
};
