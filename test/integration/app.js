const fs = require('fs');
const chai = require('chai');
const parse = require('csv-parse/lib/sync');
const app = require('../../app');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

const CURRENT_RECORDS_FILE = constants.CURRENT_RECORDS_FILE;
const OUTPUT_DIR = constants.OUTPUT_DIR;
const POMI_FILE = constants.POMI_FILE;
const REDUCED_POMI_FILE = constants.REDUCED_POMI_FILE;

describe('app', () => {
  before('delete files', () => {
    if (fs.existsSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`)) {
      fs.unlinkSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);
    }
    if (fs.existsSync(`${OUTPUT_DIR}/${POMI_FILE}`)) {
      fs.unlinkSync(`${OUTPUT_DIR}/${POMI_FILE}`);
    }
    if (fs.existsSync(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`)) {
      fs.unlinkSync(`${OUTPUT_DIR}/${REDUCED_POMI_FILE}`);
    }
  });

  it('should generate a file containing only the latest period for all GPs', function () {
    // The process usually takes about half this time i.e. 60 seconds
    this.timeout(120000);
    return Promise
      .resolve(app())
      .then(() => {
        fs.readdirSync(OUTPUT_DIR, (err, files) => {
          expect(files).to.include(POMI_FILE);
          expect(files).to.include(REDUCED_POMI_FILE);
          expect(files).to.include(CURRENT_RECORDS_FILE);
        });

        const data = fs.readFileSync(`${OUTPUT_DIR}/${CURRENT_RECORDS_FILE}`);

        const records = parse(data);
        const firstRecord = records.shift();
        const lastRecord = records.pop();

        expect(firstRecord.length).to.be.equal(3);
        expect(lastRecord.length).to.be.equal(3);
        expect(firstRecord[0]).to.be.equal(lastRecord[0]);
      });
  });
});

