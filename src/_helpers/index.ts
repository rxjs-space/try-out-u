import * as https from 'https';

export const httpsReqPromise: (requestOptions: any) => Promise<string> = (requestOptions) => new Promise((resolve, reject) => {
  const req = https.request(requestOptions, res => {
    let fullData = '';
    res.on('data', d => { fullData += d; });
    res.on('end', () => resolve(fullData));
  });
  req.end();
  req.on('error', e => reject(e));
});

