# POMI Data ETL

[![Build Status](https://travis-ci.org/nhsuk/pomi-data-etl.svg?branch=master)](https://travis-ci.org/nhsuk/pomi-data-etl)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/pomi-data-etl/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/pomi-data-etl?branch=master)

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
based on the records) and save the resulting data into
`./output/current-pomi-data.csv`

