// from https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
function apiRequest(request) {
  const url = request.url;
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    // eslint-disable-next-line global-require
    const lib = url.startsWith('https') ? require('https') : require('http');
    const getRequest = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve({ body: body.join(''), request }));
    });
    // handle connection errors of the request
    getRequest.on('error', err => reject(err));
  });
}

module.exports = apiRequest;
