const chai = require('chai');
const apiRequest = require('../../app/lib/apiRequest');

const expect = chai.expect;

describe('apiRequest', () => {
  // arrow function not used as access to 'this' required for timeout
  it('should error if the status code is not 2xx', function test(done) {
    this.timeout = 10000;
    apiRequest({ url: 'http://httpstat.us/418' }).then(done)
      .catch((err) => {
        expect(err).to.not.equal(undefined);
        expect(err.message).to.be.equal('Failed to load page, status code: 418');
        done();
      });
  }
  );
});
