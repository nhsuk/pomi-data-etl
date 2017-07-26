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
file(s) containing those records in the output dir (`./html/json/`) and create JSON
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

Upon completion the files will also be uploaded to the Azure storage location specified in the environment variable `AZURE_STORAGE_CONNECTION_STRING`.
Each file will be uploaded twice, once to overwrite the current file and another date-stamped file, i.e. `booking.json` and `20170530-booking.json`.

## Azure Blob Storage

If the recommended environment variables are used the JSON file created will be available in Azure storage at 
* [https://nhsukpomidataetl.blob.core.windows.net/etl-output/booking.json](https://nhsukpomidataetl.blob.core.windows.net/etl-output/booking.json)
* [https://nhsukpomidataetl.blob.core.windows.net/etl-output/scripts.json](https://nhsukpomidataetl.blob.core.windows.net/etl-output/scripts.json)
* [https://nhsukpomidataetl.blob.core.windows.net/etl-output/records.json](https://nhsukpomidataetl.blob.core.windows.net/etl-output/records.json)

The [Microsoft Azure Storage Explorer](http://storageexplorer.com/) may be used to browse the contents of blob storage.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                           | Description                                                          | Default                 | Required   |
| :--------------------------------- | :------------------------------------------------------------------- | ----------------------- | :--------- |
| `NODE_ENV`                         | node environment                                                     | development             |            |
| `LOG_LEVEL`                        | [log level](https://github.com/trentm/node-bunyan#levels)            | Depends on `NODE_ENV`   |            |
| `AZURE_STORAGE_CONNECTION_STRING`  | Azure storage connection string                                      |                         | yes        |
| `AZURE_TIMEOUT_MINUTES`            | Maximum wait time when uploading file to Azure                       | 10                      |            |
| `CONTAINER_NAME`                   | Azure storage container name                                         | etl-output              |            |
| `UPDATE_SCHEDULE`                  | time of day to run the upgrade                                       | 15 7 * * * (7:15 am)    |            |

## Architecture Decision Records

This repo uses
[Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
to record architectural decisions for this project.
They are stored in [doc/adr](doc/adr).
