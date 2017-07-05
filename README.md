# POMI Data ETL

[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/pomi-data-etl.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/nhsuk/pomi-data-etl.svg?branch=master)](https://travis-ci.org/nhsuk/pomi-data-etl)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/pomi-data-etl/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/pomi-data-etl?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/pomi-data-etl/badge.svg)](https://snyk.io/test/github/nhsuk/pomi-data-etl)

The application downloads a number of data sets available under POMI collection.
[Patient Online Management Information (POMI)](http://content.digital.nhs.uk/pomi)
from the NHS Digital [indicator portal](https://indicators.hscic.gov.uk/)

The data sets used within this application are:

* [Booking System](https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv)
* [Repeat Prescriptions](https://indicators.hscic.gov.uk/download/PHF10/Data/ORDER_REPEAT_PRESCRIPTIONS_POMI.csv)
* [Patient Records](https://indicators.hscic.gov.uk/download/PHF10/Data/DETAILED_CODED_RECORDS_POMI.csv )

Additional information is available within the indicator portal. Search for
the indicator reference number i.e. P02154

## Run the application

Running `scripts/start` will bring up a docker container hosting a web server and initiate the scrape at a scheduled time.
The default is 11pm. To test locally set an environment variable `ETL_SCHEDULE` to a new time, i.e. `export ETL_SCHEDULE='25 15 * * *'` to start the processing at 3:25pm. Note: the container time is GMT and does not take account of daylight saving, you may need to subtract an hour from the time.

Further details available [here](https://www.npmjs.com/package/node-schedule)

Once initiated the scrape will download the files, strip out any records that are
not for the current latest period (calculated based on the records), create csv
file(s) containing those records in the output dir (`./html/json/`) and create json 
files containing an array of objects in the form of
```
{
  "PeriodEnd": "dd/mm/yyyyy",
  "GPPracticeCode": "B82050",
  "Supplier": "${supplier}"
}
```
Where `${supplier}` will be one of the suppliers listed below
`["EMIS","INPS","Informatica","Microtest","NK","TPP"]`. Or one of these values
with an `(I)` appended e.g. `EMIS (I)`. The addition of `(I)` represents a GP
that is now using the Informatica system.

Note: The list above was created by running
`jq -c '[.[].Supplier] | unique ' html/json/pomi.json`

The json files created will be available via the container's webserver at
`http://localhost/json/booking.json`,
`http://localhost/json/scripts.json`, and
`http://localhost/json/records.json`

Files are not present until the scheduler has run and may return a 404 error prior to then.
