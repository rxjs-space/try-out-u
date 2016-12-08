import * as express from 'express';
export const authApi = express.Router();
import { environment } from '../environments/environment';
import { httpsReqFac, helper_getUserInfo } from './auth-helpers';

const ghAuth = environment.ghAuth;

authApi.get('/', (req, res) => {
  res.send('user home page');
});

authApi.get('/ghtoken', (req, res) => {
  const code = req.query.code;
  const requestOptions = {
      hostname: 'github.com',
      path: `/login/oauth/access_token?client_id=${ghAuth.cid}&client_secret=${ghAuth.csecret}&code=${code}`,
      method: 'POST'
      // client_id: ghAuth.cid,
      // client_secret: ghAuth.csecret,
      // code: ghCode
    };
  httpsReqFac(requestOptions, helper_getUserInfo(res), /*onError return to frontEnd*/); // request token and get user info with the token

});



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


