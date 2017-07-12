module.exports = {
  HEADERS: {
    ODS_CODE: 'GPPracticeCode',
    PERIOD_END: 'PeriodEnd',
    SUPPLIER: 'Supplier',
  },
  OUTPUT_DIR: 'output',
  CONTAINER_NAME: process.env.CONTAINER_NAME || 'etl-output'
};
