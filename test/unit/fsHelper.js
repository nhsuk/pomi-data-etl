const fs = require('fs');
const chai = require('chai');
const fsHelper = require('../../app/lib/fsHelper');

const expect = chai.expect;

describe('fsHelper', () => {
  describe('saveFileSync', () => {
    let tempDir;
    let tempFilePath;

    after('delete temp directory', () => {
      fs.unlinkSync(tempFilePath);
      fs.rmdirSync(tempDir);
    });

    it('should create a directory if it does not already exist, using non-default output location', () => {
      const tempFileName = 'temp';
      const data = {
        body: 'something to write to the file',
        request: { type: tempFileName }
      };
      tempDir = 'temp-test-dir';
      tempFilePath = `${tempDir}/${tempFileName}.csv`;

      fsHelper.saveFileSync(data, tempDir);
      fsHelper.saveFileSync(data, tempDir);

      const fileContents = fs.readFileSync(tempFilePath, 'utf8');
      expect(fileContents).to.be.equal(data.body);
    });
  });
});
