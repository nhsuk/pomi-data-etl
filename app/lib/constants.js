module.exports = {
  POMI: {
    DOWNLOAD_LOCATION: 'https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv',
    HEADERS: {
      ODS_CODE: 'GPPracticeCode',
      PERIOD_END: 'PeriodEnd',
      SUPPLIER: 'Supplier',
    }
  },
  SCRIPTS: {
    DOWNLOAD_LOCATION: 'https://indicators.hscic.gov.uk/download/PHF10/Data/ORDER_REPEAT_PRESCRIPTIONS_POMI.csv',
    HEADERS: {
      ODS_CODE: 'GPPracticeCode',
      PERIOD_END: 'PeriodEnd',
      SUPPLIER: 'Supplier',
    }
  },
  OUTPUT_DIR: 'output',
};
