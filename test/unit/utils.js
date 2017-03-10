const chai = require('chai');
const utils = require('../../app/lib/utils');
const constants = require('../../app/lib/constants');

const expect = chai.expect;
const PERIOD_END_HEADER = constants.HEADERS.PERIOD_END;

describe('utils', () => {
  it('should return the most recent date', () => {
    const mostRecentPeriod = '31/01/2017';
    const periods = new Set([PERIOD_END_HEADER,
      '31/12/2016',
      '30/11/2016',
      mostRecentPeriod]);

    expect(utils.getMostRecentPeriod(periods))
      .to.be.equal(mostRecentPeriod);
  });
});
