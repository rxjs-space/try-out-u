import { MongoClient } from 'mongodb';
import { environment } from '../environments/environment';

const db_url = `mongodb://${environment.mongodb.dbUsername}:${environment.mongodb.dbPassword}@${environment.mongodb.dbAt}`;
const tryCloseDb = (db, reject) => {
  try {db.close(); } catch (e) {reject(e); };
};

export const saveUserToDb = (userInfo) => new Promise((resolve, reject) => {
  MongoClient.connect(db_url)
    .then(db => {
      db.collection('users')
        .find({id: userInfo.id}).toArray()
        .then(findResult => {
          if (findResult[0]) { // if the user exists in db
            tryCloseDb(db, reject);
            const data = Object.assign({}, findResult[0]);
            delete data._id;
            resolve({ data: data, message: 'existing user' });
          } else {
            userInfo = {
              id: userInfo.id,
              login: userInfo.login,
              email: userInfo.email,
              gh_url: userInfo.html_url,
              created_at: (new Date()).toUTCString(),
            };
            db.collection('users').insertOne(userInfo)
              .then(insertResult => {
                tryCloseDb(db, reject);
                const data = Object.assign({}, insertResult.ops[0]);
                delete data._id;
                resolve({ data: data, message: 'new user' });
              })
              .catch(e => {
                tryCloseDb(db, reject); reject(e);
              });
          }
        })
        .catch(e => {
          tryCloseDb(db, reject); reject(e);
        });
    })
    .catch(e => {
      reject(e);
    });
});

