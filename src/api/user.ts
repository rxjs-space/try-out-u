import * as express from 'express';
import * as https from 'https';
export const usersApi = express.Router();

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

const ghAuthUrl = 'https://github.com/login/oauth/authorize';
const GH_CID = process.env.GH_CID || 'b2dc087b88922e0b5e34';
const GH_CSECRET = process.env.GH_CSECRET || '64e4ac3b205e933887c90bbaac82fdfcdb30ab98';
const GH_CSTATE = Math.random();
// doc: https://developer.github.com/v3/oauth/
// GH_CSTATE is an unguessable random string. 
// It is used to protect against cross-site request forgery attacks.

usersApi.get('/', (req, res) => {
  res.send('user home page');
});

usersApi.get('/login', (req, res) => {
  https.get(`${ghAuthUrl}?client_id=${GH_CID}&state=${GH_CSTATE}`, ghRes => {
    console.log(ghRes.headers);
  });
});


