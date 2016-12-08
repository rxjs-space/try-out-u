import { MongoClient, Db, ObjectID } from 'mongodb';
import { environment } from '../environments/environment';

// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/bindNodeCallback';

const db_url = `mongodb://${environment.mongodb.dbUsername}:${environment.mongodb.dbPassword}@${environment.mongodb.dbAt}`;

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
    this._dbRx = <Observable<Db>>Observable.fromPromise(MongoClient.connect(dbUrl));
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

  exec(): void {
    if (!this._operations.length) { throw new Error('operations list is empty.')};
    this._dbRx.subscribe(db => {
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
                briefResult: result
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
      const concatenatedRx = Observable.concat(...operationsRx);
      concatenatedRx.subscribe(result => {
        console.log(result);
      }, err => {
        try {
          db.close();
        } catch (e) {
          err = [err, e];
        }
        throw err;
      }, () => { // once the concatenatedRx completes
        db.close();
        this._operations = [];
      });
    }, err => {
      throw err;
    });
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


}

const qbPre = new QueryBuilderPre(db_url);

export const qbFac = (collection) => qbPre.collection(collection);

const qb = qbPre.collection('abc');
// qb.insertOne({x: 5}).find({x: 2}).exec();
// const obj_id = ObjectID.createFromHexString('58482cb8a3d6970c1810b635');
// qb.find({_id: obj_id}).deleteOne({_id: obj_id}).find({_id: obj_id}).exec();
const obj_id = ObjectID.createFromHexString('58482b8d1c7bc720c085bdc7');
qb.updateOne({_id: obj_id}, {$set: {b: 1}}).find({_id: obj_id}).exec();


/*


   [ { _id: 58482b8d1c7bc720c085bdc7, x: 2, b: 1 },
     { _id: 58482bef684d602214a835ed, x: 2 },
     { _id: 58482c08df910a21f8fcfd9b, x: 2 },
     { _id: 58482cb8a3d6970c1810b635, x: 2 },
     { _id: 58482ce47a902429f889642b, x: 2 },
     { _id: 58482d890c5a2115f8fc4682, x: 2 },
     { _id: 58482dbf6723821998ace2ea, x: 2 },
     { _id: 58482dd6d8aa2f14a458b617, x: 2 },
     { _id: 58482dfff912f824ec7bde12, x: 2 } ] }
     
     */

