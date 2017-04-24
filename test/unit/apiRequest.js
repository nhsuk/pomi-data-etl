const chai = require('chai');
const apiRequest = require('../../app/lib/apiRequest');

const expect = chai.expect;

describe('apiRequest', () => {
  it('should error if the status code is not 2xx', () =>
    apiRequest({ url: 'http://httpstat.us/418' })
    .catch((err) => {
      expect(err).to.not.equal(undefined);
      expect(err.message).to.be.equal('Failed to load page, status code: 418');
    })
  );
});
