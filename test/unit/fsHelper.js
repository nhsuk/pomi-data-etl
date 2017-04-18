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
      const content = 'something to write to the file';
      tempDir = 'temp-test-dir';
      const tempFileName = 'temp';
      tempFilePath = `${tempDir}/${tempFileName}.csv`;

      fsHelper.saveFileSync(content, tempFileName, tempDir);
      fsHelper.saveFileSync(content, tempFileName, tempDir);

      const fileContents = fs.readFileSync(tempFilePath, 'utf8');
      expect(fileContents).to.be.equal(content);
    });
  });
});
