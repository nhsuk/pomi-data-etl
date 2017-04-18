const fs = require('fs');
const chai = require('chai');
const parse = require('csv-parse/lib/sync');
const app = require('../../app');
const constants = require('../../app/lib/constants');
const fileUtils = require('../../app/lib/fileUtils');

const expect = chai.expect;

const CURRENT_RECORDS_FILE = fileUtils.getCurrentRecordsFileName('POMI');
const OUTPUT_DIR = constants.OUTPUT_DIR;
const POMI_FILE = 'pomi.csv';
const REDUCED_POMI_FILE = fileUtils.getReducedFileName('POMI');
const JSON_FILE = fileUtils.getJsonFileName('POMI');

const PERIOD_END_HEADER = constants.POMI.HEADERS.PERIOD_END;
const SUPPLIER_HEADER = constants.POMI.HEADERS.SUPPLIER;
const ODS_CODE_HEADER = constants.POMI.HEADERS.ODS_CODE;

describe('app', () => {
  describe('booking system data', () => {
    before('delete files and run download process', function beforeTest() {
      // The process takes 60 seconds on a half decent connection
      // Travis takes quite a bit longer, hence the 8 minute timeout
      this.timeout(480000);
      if (fs.existsSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`)) {
        fs.unlinkSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);
      }
      if (fs.existsSync(`${OUTPUT_DIR}/${POMI_FILE}`)) {
        fs.unlinkSync(`${OUTPUT_DIR}/${POMI_FILE}`);
      }
      if (fs.existsSync(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`)) {
        fs.unlinkSync(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`);
      }

      return Promise.resolve(app.downloadAndProcessBookingSystem());
    });

    it('should download the pomi data file', () => {
      fs.readdirSync(OUTPUT_DIR, (err, files) => {
        expect(files).to.include(POMI_FILE);
      });
    });

    it('should generate an intermediate file containing only the relevant 3 columns, with a header', () => {
      fs.readdirSync(OUTPUT_DIR, (err, files) => {
        expect(files).to.include(REDUCED_POMI_FILE);
      });

      const data = fs.readFileSync(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`);

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
