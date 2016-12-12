import * as express from 'express';
export const usersApi = express.Router();

usersApi.get('/', (req, res) => {
  res.send('user home page');
});



