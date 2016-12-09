// import * as https from 'https';
import { qbFac } from '../_model';
import { httpsReqFac } from '../_helpers';

// export const httpsReqFac = (requestOptions, cb?, cbE?) => {
//   const req = https.request(requestOptions, res => {
//     let fullData = '';
//     res.on('data', d => { fullData += d; });
//     res.on('end', () => {
//       if (cb) {
//         cb(fullData);
//       } else {
//         console.log(fullData);
//       }
//     });
//   });
//   req.end();
//   req.on('error', e => {
//     if (cbE) {
//       cbE(e);
//     } else {
//       throw e;
//     }
//   });
// };

const saveUserInfo = (topRes) => {
  return (userInfo) => {
    const qb = qbFac('users');
    const userInfoObj = JSON.parse(userInfo);
    // console.log(userInfoObj);
    qb.find({id: userInfoObj.id}).rx().subscribe(results => {
      if (results[0].briefResult[0]) {
        console.log('user exist');
      } else {

        qb.insertOne(userInfoObj).rx().subscribe(rresults => {
          topRes.send(rresults);
        }, err => console.log(err));

      }
    }, err => {
      console.log(err);
    });

  };
};



// (userInfo, topRes) => {
//   const qb = qbFac('users');
//   const userInfoObj = JSON.parse(userInfo);
//   console.log(userInfoObj);
//   qb.insertOne(userInfoObj).rx().subscribe(results => {
//     console.log(results);
//   }, err => console.log(err));
// };



export const helper_getUserInfo = (topRes) => {
  return (rawData) => {
    const access_token = rawData.match(/access_token=(.*?)&/)[1];
    const requestOptions = {
      hostname: 'api.github.com',
      path: `/user?access_token=${access_token}`,
      method: 'GET',
      headers: { 'User-Agent': 'tryau-dev' }
    };
    httpsReqFac(requestOptions, saveUserInfo(topRes)/*saveToDb and return to frontEnd, send Error and return to frontEnd*/);
  };
}




