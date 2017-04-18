const chai = require('chai');
const fileUtils = require('../../app/lib/fileUtils');

const expect = chai.expect;

describe('fileUtils', () => {
  const mixedCaseFileName = 'MIxedCaSe';
  const lowerCaseFileName = `${mixedCaseFileName.toLowerCase()}`;

  describe('getReducedFileName', () => {
    it('should return the name of the reduced file based on the supplied name and be lower case', () => {
      const returnedFileName = fileUtils.getReducedFileName(mixedCaseFileName);

      expect(returnedFileName).to.be.equal(`${lowerCaseFileName}-reduced.csv`);
    });
  });

  describe('getCurrentRecordsFile', () => {
    it('should return the name of the current records file based on the supplier name and be lower case', () => {
      const returnedFileName = fileUtils.getCurrentRecordsFileName(mixedCaseFileName);

      expect(returnedFileName).to.be.equal(`${lowerCaseFileName}-current.csv`);
    });
  });

  describe('getJsonFileName', () => {
    it('should return the name of the JSON file based on the supplied name and be lower case', () => {
      const returnedFileName = fileUtils.getJsonFileName(mixedCaseFileName);

      expect(returnedFileName).to.be.equal(`${lowerCaseFileName}.json`);
    });
  });

  describe('getSimpleFileName', () => {
    it('should return the name of the CSV file based on the supplied name and be lower case', () => {
      const returnedFileName = fileUtils.getSimpleFileName(mixedCaseFileName);

      expect(returnedFileName).to.be.equal(`${lowerCaseFileName}.csv`);
    });
  });
});
