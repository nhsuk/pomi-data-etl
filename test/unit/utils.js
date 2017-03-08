const chai = require('chai');
const utils = require('../../app/lib/utils');

const expect = chai.expect;

describe('utils', () => {
  it('should return the most recent date', () => {
    const mostRecentPeriod = '31/01/2017';
    const periods = new Set(['31/12/2016', '30/11/2016', mostRecentPeriod]);

    expect(utils.getMostRecentPeriod(periods))
      .to.be.equal(mostRecentPeriod);
  });
});

