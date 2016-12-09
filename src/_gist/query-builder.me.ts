import { MongoClient, Db, /*ObjectID*/ } from 'mongodb';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
// import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

const db_url = `mongodb://${environment.mongodb.dbUsername}:${environment.mongodb.dbPassword}@${environment.mongodb.dbAt}`;


/*

{ login: 'rxjs-space',
  id: 21194887,
  avatar_url: 'https://avatars.githubusercontent.com/u/21194887?v=3',
  gravatar_id: '',
  url: 'https://api.github.com/users/rxjs-space',
  html_url: 'https://github.com/rxjs-space',
  followers_url: 'https://api.github.com/users/rxjs-space/followers',
  following_url: 'https://api.github.com/users/rxjs-space/following{/other_user}',
  gists_url: 'https://api.github.com/users/rxjs-space/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/rxjs-space/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/rxjs-space/subscriptions',
  organizations_url: 'https://api.github.com/users/rxjs-space/orgs',
  repos_url: 'https://api.github.com/users/rxjs-space/repos',
  events_url: 'https://api.github.com/users/rxjs-space/events{/privacy}',
  received_events_url: 'https://api.github.com/users/rxjs-space/received_events',
  type: 'User',
  site_admin: false,
  name: null,
  company: null,
  blog: null,
  location: null,
  email: 'rxjs-space@outlook.com',
  hireable: true,
  bio: null,
  public_repos: 13,
  public_gists: 1,
  followers: 0,
  following: 0,
  created_at: '2016-08-23T10:24:18Z',
  updated_at: '2016-12-08T09:28:02Z' }

*/

type obj =  {[index: string]: any};

interface QueryOptions {
  collection?: string;
  query?: obj;
  opts?: obj;
  sort?: obj;
  offset?: number;
  limit?: number;
}

type QueryType = 'insertOne' | 'find' | 'updateOne' | 'deleteOne'

interface QueryAction {
  type: QueryType;
  query: obj;
  update?: obj;
  options?: obj;
}

interface QueryResult {
  type: QueryType;
  briefResult?: obj;
  fullResult?: obj;
}

class QueryBuilderPre {
  private _defaultOptions: QueryOptions = {
    collection: null,
    query: {},
    opts: {},
    sort: {},
    offset: 0,
    limit: 0
  };
  private _options: QueryOptions;
  private _dbRx: Observable<Db>;

  constructor(dbUrl: string, options?: QueryOptions) {
    this._dbRx = <Observable<Db>>Observable.bindNodeCallback(MongoClient.connect)(dbUrl);
    if (!options) {
      this._options = this._defaultOptions;
    } else {
      this._options = Object.assign({}, this._defaultOptions, options);
    }
  }
  collection(collection: string): QueryBuilder {
    if (typeof collection !== 'string' || collection === '') {
      throw new Error('collection name must be a string, whoes length is greater than 0.');
    }
    this._options = Object.assign({}, this._options, {
      collection
    });
    return new QueryBuilder(this._dbRx, this._options);
  }

}

class QueryBuilder {
  private _dbRx: Observable<Db>;
  private _options: any;
  private _operations: QueryAction[] = [];

  constructor(dbRx, options) {
    this._dbRx = dbRx;
    this._options = options;
  }

  insertOne(query: obj): QueryBuilder {
    this._operations.push({type: 'insertOne', query});
    return this;
  }

  find(query: obj): QueryBuilder {
    this._operations.push({type: 'find', query});
    return this;
  }

  updateOne(query: obj, update: obj): QueryBuilder {
    this._operations.push({type: 'updateOne', query, update});
    return this;
  }

  deleteOne(query: obj): QueryBuilder {
    this._operations.push({type: 'deleteOne', query});
    return this;
  }

  rx(): Observable<QueryResult[]> {
    if (!this._operations.length) { return Observable.throw(new Error('operations list is empty.')); };
    return this._dbRx.switchMap(db => {
      const coll = db.collection(this._options.collection);
      const operationsRx = this._operations.map(operation => {
        switch (operation.type) {
          case 'insertOne':
            return Observable.fromPromise(coll.insertOne(operation.query))
              .map(<(result: any) => QueryResult>(result => ({
                type: operation.type,
                briefResult: result.ops,
                // fullResult: result
              })));
          case 'find':
            return Observable.fromPromise(coll.find(operation.query).toArray())
              .map(<(result: any) => QueryResult>(result => ({
                type: operation.type,
                briefResult: result // this is an array
              })));
          case 'updateOne':
            return Observable.fromPromise(coll.updateOne(operation.query, operation.update, operation.options = {}))
              .map(<(result: any) => QueryResult>(result => ({
                type: operation.type,
                briefResult: {ok: result.result.ok, nModified: result.result.nModified, n: result.result.n},
                // fullResult: result
              })));
          case 'deleteOne':
            return Observable.fromPromise(coll.deleteOne(operation.query))
              .map(<(result: any) => QueryResult>(result => ({
                type: operation.type,
                briefResult: {ok: result.result.ok, n: result.result.n},
                // fullResult: result
              })));

        }
      });
      return Observable.concat(...operationsRx).toArray();
    }, (db, results) => ({db, results}))
    .map(v => { // after getting the array, close the db.
      v.db.close();
      return v.results;
    });
  }

}

      // concatenatedRx.subscribe(result => {
      //   console.log(result);
      // }, err => {
      //   try {
      //     db.close();
      //   } catch (e) {
      //     err = [err, e];
      //   }
      //   throw err;
      // }, () => { // once the concatenatedRx completes
      //   db.close();
      //   this._operations = [];
      // });

const qbPre = new QueryBuilderPre(db_url);

export const qbFac = (collection) => qbPre.collection(collection);

const qb = qbPre.collection('abc');
// qb.find({x: 1}).rx().subscribe(
//   results => {
//     console.log(results);
//   },
//   e => console.log(e),
// )

// qb.insertOne({x: 5}).rx().subscribe(console.log);

// const obj_id = ObjectID.createFromHexString('58482cb8a3d6970c1810b635');
// qb.find({_id: obj_id}).deleteOne({_id: obj_id}).find({_id: obj_id}).exec();

// const obj_id = ObjectID.createFromHexString('58482b8d1c7bc720c085bdc7');
// qb.updateOne({_id: obj_id}, {$set: {b: 1}}).find({_id: obj_id}).exec();



/*


   [ { _id: 58482b8d1c7bc720c085bdc7, x: 2, b: 1 },


   { _id: 584826c53b0c2403bceb3e6e, x: 1 },
     { _id: 5848270d1a86781fdcaaaf4f, x: 1 },
     { _id: 5848273301bd932354871976, x: 1 },
     { _id: 5848275c6d97602a78b9c148, x: 1 },
     { _id: 584827fb948a1d0830aeba54, x: 1 },
     { _id: 584828df0d8ec30df0ea0d73, x: 1 },
     { _id: 5848290870f35203d45f115c, x: 1 },
     { _id: 58482929a802f51998fe3143, x: 1 },
     { _id: 584829cf6c26f31d68daf1cd, x: 1 },
     { _id: 58482a8405770801a0dd8c49, x: 1 },
     { _id: 58482af36e41281550e900c5, x: 1 },
     { _id: 58482b8d1c7bc720c085bdc7, x: 2, b: 1 },
     { _id: 58482ce47a902429f889642b, x: 2 },
     { _id: 58482d890c5a2115f8fc4682, x: 2 },
     { _id: 58482dbf6723821998ace2ea, x: 2 },
     { _id: 58482dd6d8aa2f14a458b617, x: 2 },
     { _id: 58482dfff912f824ec7bde12, x: 2 },
     { _id: 58483e5f3a9c7628f8b1adb4, x: 5 },
     { _id: 58483e7a8af4820cdc675216, x: 5 },
     { _id: 58483f4192e21027f4799575, x: 5 },
     { _id: 58483f533affef0354e17aaf, x: 5 },
     { _id: 58483f702503722bc4220ba5, x: 5 },
     { _id: 58483f934f0f8a22fc1c10c3, x: 5 },
     { _id: 58483fd0edebca103c9a3c39, x: 5 },
     { _id: 584841306c55110370dde40b, x: 5 },
     { _id: 5848417c22448013a4767218, x: 5 },
     { _id: 5848418c0797ab054819e4e2, x: 5 },
     { _id: 584841ccf64dc11df0342a40, x: 5 },
     { _id: 58484201cc8a971eac50fa04, x: 5 },
     { _id: 584842b18cffb01be4c7b745, x: 5 },
     { _id: 584842ffbadd4d130c5df2f9, x: 5 },
     { _id: 584843168f44731760f7a330, x: 5 },
     { _id: 5848433859b99f0614ed2f13, x: 5 },
     { _id: 5848435dcb95fc0ff4df7340, x: 5 },
     { _id: 584843def69c4429006ba090, x: 5 },
     { _id: 584844598a293718f8db6a5f, x: 5 },
     { _id: 58484497274cac177c392c55, x: 5 },
     { _id: 58484566e24c40272046ea7d, x: 5 },
     { _id: 58484581fffe1e256451d9e6, x: 5 },
     { _id: 584845981e3f3e15640bf6fb, x: 5 },
     { _id: 584845e2c1b8b1140c5aed8f, x: 5 },
     { _id: 584845f80b8fc928e84433db, x: 5 },
     { _id: 584846072aad3224b01d5935, x: 5 },
     { _id: 5848464423f9b21bac11e12c, x: 5 },
     { _id: 58484665b28df11574eafaea, x: 5 },
     { _id: 584846971d3079141467038a, x: 5 },
     { _id: 5848c3d84644b90ac4f29354, x: 5 },
     { _id: 5848c4bc367eed18a8c0c60a, x: 5 },
     { _id: 5848c51d9da64434107d08dc, x: 5 },
     { _id: 5848c54595f52212b4796dfc, x: 5 },
     { _id: 5848c5a2a7e113218490a608, x: 5 },
     { _id: 5848c5bfe250bd30f0d3eacc, x: 5 },
     { _id: 5848c5c997494d00e02d01b9, x: 5 },
     { _id: 5848c60d8d89cf1c6c68ce04, x: 5 },
     { _id: 5848c62d47172b1068cb789c, x: 5 },
     { _id: 5848c67136000c306c903348, x: 5 },
     { _id: 5848c6aff59a5c22b8042fa3, x: 5 },
     { _id: 5848c6e9278c3f32b82ed515, x: 5 },
     { _id: 5848c7485796b725d4e64aa1, x: 5 },
     { _id: 5848c7540fdd773730bfa3a1, x: 5 },
     { _id: 5848c763d56ecf2be8559df6, x: 5 },
     { _id: 5848c79f0326400d48f6a391, x: 5 },
     { _id: 5848c86316895d2a38d85bfe, x: 5 },
     { _id: 5848c86ebbcced33d89db384, x: 5 },
     { _id: 5848c889106b462be0a0e9a1, x: 5 },
     { _id: 5848c890b05ed61d7852bdfd, x: 5 },
     { _id: 5848c89ba3371a08e088dd13, x: 5 },
     { _id: 5848c8ecb81ba43b70ba96e7, x: 5 },
     { _id: 5848c935e38aac2554d62f18, x: 5 },
     { _id: 5848c95aca3a392db8e44397, x: 5 },
     { _id: 5848c9a0c80dd71b487e0dd9, x: 5 },
     { _id: 5848ca12da98b8196cb0fa8b, x: 5 },
     { _id: 5848ca2ee029020140a2f2f2, x: 5 },
     { _id: 5848ca4ead20d804902214d7, x: 5 },
     { _id: 5848ca5d81b244249c61d1b4, x: 5 },
     { _id: 5848ca6efe8b6f1eb414bdeb, x: 5 },
     { _id: 5848cae10059691dccb3a43d, x: 5 },
     { _id: 5848cd19ea3b773918923b97, x: 5 },
     { _id: 5848cd26b49d85334061647c, x: 5 },
     { _id: 5848cd3da6d76a07d4a8d4d9, x: 5 },
     { _id: 5848cd4ccc370b1f8869af52, x: 5 },
     { _id: 5848cd5a6503882a1cfc54be, x: 5 },
     { _id: 5848cd768f6f6f08a04dd135, x: 5 },
     { _id: 5848d6d891f4552e20ab9d68, x: 5 } ] }

     
     */

