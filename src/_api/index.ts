import * as express from 'express';
import { usersApi } from './user';
import { authApi } from './auth';

export const api = express.Router();

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

api.use('/users', usersApi);
api.use('/auth', authApi);
