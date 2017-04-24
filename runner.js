const app = require('./app');

const bookingDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/BOOK_CANCEL_APPOINTMENTS_POMI.csv';
const scriptsDownloadUrl = 'https://indicators.hscic.gov.uk/download/PHF10/Data/ORDER_REPEAT_PRESCRIPTIONS_POMI.csv';

app.downloadAndProcessFile({ type: 'SCRIPTS', url: scriptsDownloadUrl });
app.downloadAndProcessFile({ type: 'BOOKING', url: bookingDownloadUrl });
