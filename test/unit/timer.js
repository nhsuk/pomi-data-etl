const chai = require('chai');

const expect = chai.expect;
const timer = require('../../app/lib/timer');

describe('timer smoke tests', () => {
  it('should wrap value in timer', (done) => {
    const value = { id: 123, type: 'test' };
    const message = 'test timer';

    timer.start(value, message).then((result) => {
      // verify value returned unchanged
      expect(result).to.equal(value);
      timer.end(message);
      done();
    });
  });
});
