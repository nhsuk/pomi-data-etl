const logger = require('../../app/lib/logger');

describe('logger smoke tests', () => {
  it('should log info', () => logger.info('info'));
  it('should log error', () => logger.error('error'));
  it('should log time', () => {
    logger.time('test-timer');
    logger.timeEnd('test-timer');
  });
});
