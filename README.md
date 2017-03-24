# POMI Data ETL

[![Build Status](https://travis-ci.org/nhsuk/pomi-data-etl.svg?branch=master)](https://travis-ci.org/nhsuk/pomi-data-etl)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/pomi-data-etl/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/pomi-data-etl?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/pomi-data-etl/badge.svg)](https://snyk.io/test/github/nhsuk/pomi-data-etl)

The application downloads the
[Patient Online Management Information (POMI)](http://content.digital.nhs.uk/pomi)
from the NHS Digital [indicator portal](https://indicators.hscic.gov.uk/)
via the direct download
[link](https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv)

Additional information is available within the indicator portal. Search for
the indicator reference number i.e. P02154

## Run the application

Once the repo is cloned and the dependencies are installed (`npm install`)
The application can be run via `npm run start`. This will download the file,
strip out any records that are not for the current latest period (calculated
based on the records), create a csv file containing those records
(`./output/current-pomi-data.csv`) and create a json file containing
an array of objects in the form of
```
{
  "PeriodEnd": "dd/mm/yyyyy",
  "GPPracticeCode": "B82050",
  "Supplier": "${supplier}"
}
```
Where `${supplier}` is one of
`["EMIS","EMIS (I)","INPS","INPS (I)","Informatica","Microtest","NK","TPP"]`

Generated by running `jq -c '[.[].Supplier] | unique ' output/pomi.json`
