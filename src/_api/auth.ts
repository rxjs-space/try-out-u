import * as express from 'express';
import * as https from 'https';
export const authApi = express.Router();
import { environment } from '../environments/environment';
// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

const ghAuth = environment.ghAuth;
const helper_getUserInfo = (access_token, upperRes) => {
  const req = https.request({
    hostname: 'api.github.com',
    path: `/user?access_token=${access_token}`,
    method: 'GET',
    headers: {
      'User-Agent': 'tryau-dev'
    }
  }, res => {
    let fullData = '';
    res.on('data', d => {
      fullData += d;
    });
    res.on('end', () => {
      console.log(fullData);
      upperRes.send(fullData);
    });
  });
  req.end();
  req.on('error', e => {
    upperRes.send(e);
  });
}

authApi.get('/', (req, res) => {
  res.send('user home page');
});

authApi.get('/ghtoken', (req, res) => {
  const code = req.query.code;

  const rreq = https.request({
      hostname: 'github.com',
      path: `/login/oauth/access_token?client_id=${ghAuth.cid}&client_secret=${ghAuth.csecret}&code=${code}`,
      method: 'POST'
      // client_id: ghAuth.cid,
      // client_secret: ghAuth.csecret,
      // code: ghCode
    }, (rres) => {
      let rawData = '';
      console.log(rres.statusCode);
      rres.on('data', d => {
        rawData += d;
      })
      rres.on('end', () => {
        const access_token = rawData.match(/access_token=(.*?)&/)[1];
        helper_getUserInfo(access_token, res);
      })
    })
    rreq.end();
    rreq.on('error', err => res.send(err));
  // res.send('o');

});


// async function f2() {
//   var y = await 20;
//   console.log(y); // 20
// }
// f2();




/*
browser goto gh auth page
return to GET /login with a code
POST to gh for ghToken
save the ghToken in localStorage
use the ghToken to get user info

send the info to api/users to save the user
gen myToken
send to front and save to localStorage

*/


