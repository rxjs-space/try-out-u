import { MongoClient, Db } from 'mongodb';
import { environment } from '../environments/environment';

// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/bindNodeCallback';

const db_url = `mongodb://${environment.mongodb.dbUsername}:${environment.mongodb.dbPassword}@${environment.mongodb.dbAt}`;

class QueryBuilderPre {
  private _defaultOptions: any = {
    collection: null,
    query: {},
    opts: {},
    sort: {},
    offset: 0,
    limit: 0
  };
  private _options: any;
  private _dbRx: Observable<Db>;

  constructor(dbUrl: string, options?: any) {
    this._dbRx = <Observable<Db>>Observable.bindNodeCallback(MongoClient.connect)(dbUrl);
    if (!options) {
      this._options = this._defaultOptions;
    } else {
      this._options = Object.assign({}, this._defaultOptions, options)
    }
  }
  collection(collection: string) {
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
  private _operations: {method: string, query: Object}[] = [];
  private _db: Db;

  constructor(dbRx, options) {
    this._dbRx = dbRx;
    this._options = options;
  }

  insertOne(doc: {[index: string]: any}): any {
    this._operations.push({
      method: 'insertOne',
      query: doc
    });
    return this;
  }

  exec() {
    if (!this._operations.length) { throw new Error('operations list is empty.')};
    this._dbRx.subscribe(db => {
      const coll = db.collection(this._options.collection);
      const operationsRx = this._operations.map(operation => {
        switch (operation.method) {
          case 'insertOne':
            return Observable.fromPromise(coll.insertOne(operation.query));
          case 'find':
            return Observable.fromPromise(coll.find(operation.query).toArray());
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
      }, () => {
        db.close();
        this._operations = [];
      })
    }, err => {
      throw err;
    });
  }

  find(query: {[index: string]: any}) {
    this._operations.push({
      method: 'find',
      query: query
    });
    return this;
  }

  updateOne(query: {[index: string]: any}, newProps: {[index: string]: any}) {
    if (!this._options.collection) {throw new Error('Into which collection shall I insert this doc?')};
    this._dbRx.subscribe(db => {
      db.collection(this._options.collection).updateOne(query, {$set: newProps}, (err, result) => {
        if (err) { throw err; }
        console.log(result);
        db.close();
      });
    }, err => {
      throw err;
    });
  }

}
const qbPre = new QueryBuilderPre(db_url);
const qb = qbPre.collection('abc');
qb.insertOne({x: 5}).find({x: 2}).exec();
// qb.insertOne({x: 5});
// qb.insert({x:3}).find({x:3});
// qb.find({x:2});
// qb.updateOne({a: 1}, {b: 2});


