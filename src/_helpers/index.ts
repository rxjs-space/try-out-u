import * as https from 'https';

export const httpsReqFac = (requestOptions, cb?, cbE?) => {
  const req = https.request(requestOptions, res => {
    let fullData = '';
    res.on('data', d => { fullData += d; });
    res.on('end', () => {
      if (cb) {
        cb(fullData);
      } else {
        console.log(fullData);
      }
    });
  });
  req.end();
  req.on('error', e => {
    if (cbE) {
      cbE(e);
    } else {
      throw e;
    }
  });
};