import * as express from 'express';
export const authApi = express.Router();

import * as jwt from 'jsonwebtoken';
import { environment } from '../environments/environment';
import { httpsReqPromise } from '../_helpers';
import { saveUserToDb } from '../_model';

const ghAuth = environment.ghAuth;
const csecret = process.env.GH_CSECRET || '64e4ac3b205e933887c90bbaac82fdfcdb30ab98';

const codeToGhToken = (code) => new Promise((resolve, reject) => {
  const requestOptions = {
    hostname: 'github.com',
    path: `/login/oauth/access_token?client_id=${ghAuth.cid}&client_secret=${csecret}&code=${code}`,
    method: 'POST'
  };
  httpsReqPromise(requestOptions)
    .then((fullData) => {
      const ghToken = fullData.match(/access_token=(.*?)&/)[1];
      resolve(ghToken);
    })
    .catch(e => reject(e));
});

const ghTokenToUserInfo = (ghToken) => new Promise((resolve, reject) => {
  const requestOptions = {
    hostname: 'api.github.com',
    path: `/user?access_token=${ghToken}`,
    method: 'GET',
    headers: { 'User-Agent': 'tryau-dev' }
  };
  httpsReqPromise(requestOptions)
    .then((fullData) => {
      const userInfo = JSON.parse(fullData);
      // console.log(userInfo);
      resolve(userInfo);
    })
    .catch(e => reject(e));
});

const genMySiteToken = (dbResult) => new Promise((resolve, reject) => {
  const payload = Object.assign({}, dbResult, {
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
  });
  const secret = 'foraiur';
  // sign(payload, secretOrPrivateKey, options, callback): void;
  const mySiteToken = jwt.sign(payload, secret);
  resolve(mySiteToken);
});

authApi.get('/', (req, res, next) => {
  // console.log(req);
  if (req.query.code) {
    console.log('authentication processing...');
    codeToGhToken(req.query.code) // a POST request to gh
      .then(ghTokenToUserInfo)    // a GET request to gh/api
      .then(saveUserToDb)         // find({id: user.id}), none -> insertOne
      .then(genMySiteToken)
      .then((mySiteTokenX) => {
        console.log('authentication done.');
        res.send(mySiteTokenX);
      })
      .catch(e => {
        res.status(500).send(e);
      });
  } else {
    res.status(400).send('no gh-code');
  }
});

authApi.get('/gh-auth-info', (req, res) => {
  res.send(ghAuth);
})




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


