const fs = require('fs');
const chai = require('chai');
const parse = require('csv-parse/lib/sync');
const nock = require('nock');

const downloadAndProcessFile = require('../../app/lib/downloadAndProcessFile');
const constants = require('../../app/lib/constants');
const fileUtils = require('../../app/lib/fileUtils');
const fsHelper = require('../../app/lib/fsHelper');

const expect = chai.expect;

const OUTPUT_DIR = 'temp';
const FILE_NAME = 'TEST-POMI';
const CURRENT_RECORDS_FILE = fileUtils.getCurrentRecordsFileName(FILE_NAME);
const JSON_FILE = fileUtils.getJsonFileName(FILE_NAME);
const REDUCED_BOOKING_FILE = fileUtils.getReducedFileName(FILE_NAME);
const SIMPLE_FILE_NAME = fileUtils.getSimpleFileName(FILE_NAME);

const PERIOD_END_HEADER = constants.HEADERS.PERIOD_END;
const SUPPLIER_HEADER = constants.HEADERS.SUPPLIER;
const ODS_CODE_HEADER = constants.HEADERS.ODS_CODE;

const testFilePath = `test/resources/${SIMPLE_FILE_NAME}`;
const testFileServer = 'http://some.server';
const testFileServerPath = '/test-pomi.csv';
const testFileUrl = `${testFileServer}${testFileServerPath}`;

describe('app', () => {
  describe('processing of data from URL (stubbed)', () => {
    const stubbedData = fs.readFileSync(testFilePath);
    nock(testFileServer)
      .get(testFileServerPath)
      .reply(200, stubbedData);

    before('delete files and run process', () => {
      if (fsHelper.fileExists(`${OUTPUT_DIR}/${testFilePath}`)) {
        fs.unlinkSync(`${OUTPUT_DIR}/${testFilePath}`);
      }

      return Promise.resolve(
        downloadAndProcessFile(
          { type: FILE_NAME, url: testFileUrl, OUTPUT_DIR }
        ));
    });

    it('should save the original data file', () => {
      fs.readdirSync(OUTPUT_DIR, (err, files) => {
        expect(files).to.include(testFilePath);
      });
    });

    it('should generate an intermediate file containing only the relevant 3 columns, with a header', () => {
      fs.readdirSync(OUTPUT_DIR, (err, files) => {
        expect(files).to.include(REDUCED_BOOKING_FILE);
      });

      const data = fs.readFileSync(`${OUTPUT_DIR}/${REDUCED_BOOKING_FILE}`);

      const records = parse(data);
      const headerRecord = records.shift();

      expect(headerRecord.length).to.be.equal(3);
      expect(headerRecord[0]).to.be.equal(PERIOD_END_HEADER);
      expect(headerRecord[1]).to.be.equal(ODS_CODE_HEADER);
      expect(headerRecord[2]).to.be.equal(SUPPLIER_HEADER);
    });

    it('should generate an intermediate file containing only the latest period for all GPs, with a header', () => {
      fs.readdirSync(OUTPUT_DIR, (err, files) => {
        expect(files).to.include(CURRENT_RECORDS_FILE);
      });

      const data = fs.readFileSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);

      const records = parse(data);
      const headerRecord = records.shift();
      const firstRecord = records.shift();
      const lastRecord = records.pop();

      expect(headerRecord.length).to.be.equal(3);
      expect(headerRecord[0]).to.be.equal(PERIOD_END_HEADER);
      expect(headerRecord[1]).to.be.equal(ODS_CODE_HEADER);
      expect(headerRecord[2]).to.be.equal(SUPPLIER_HEADER);
      expect(lastRecord.length).to.be.equal(3);
      expect(firstRecord[0]).to.be.equal(lastRecord[0]);
    });

    it('should generate a json file containing all of the records from the latest period csv', () => {
      const jsonFileContents = fs.readFileSync(`${OUTPUT_DIR}/${JSON_FILE}`, 'utf8');
      const csvFileContents = fs.readFileSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);

      const csvRecords = parse(csvFileContents);
      const jsonRecords = JSON.parse(jsonFileContents);
      const csvRecordLength = csvRecords.length - 1; // account for header in csv

      expect(csvRecordLength).to.be.equal(jsonRecords.length);
      jsonRecords.forEach((item) => {
        expect(item).to.have.all.keys([ODS_CODE_HEADER, PERIOD_END_HEADER, SUPPLIER_HEADER]);
      });
    });
  });
});
