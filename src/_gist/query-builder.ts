/* @flow */

import { Observable, Disposable, ReplaySubject } from 'rx';
import { MongoClient } from 'mongodb';
import { dbUrl } from './config';

class QueryBuilder {

  static connect(url: string): QueryBuilder {
    const db$ = new ReplaySubject(1);

    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.error('Database connection error:', err.message, err.stack);
        db$.onError(err);
      }
      else {
        console.log('Connected to database on', url);
        db$.onNext(db);
      }

      db$.onCompleted();
    });

    return new QueryBuilder(db$);
  }

  _db$: Observable;
  _selectors: any;
  _sub: Disposable;

  constructor(db$: Observable, selectors?: Object) {
    this._db$ = db$;
    this._sub = this._db$.subscribe();

    if (!selectors) {
      this._selectors = {
        collection: null,
        query: {},
        opts: {},
        sort: {},
        offset: 0,
        limit: 0
      };
    } else {
      this._selectors = selectors;
    }
  }

  close(): any {
    this._sub.dispose();

    return QueryBuilder;
  }

  collection(name: string): QueryBuilder {
    const ss = Object.assign({}, this._selectors, { collection: name });
    return new QueryBuilder(this._db$, ss);
  }

  select(query: Object = {}, opts: Object = {}): QueryBuilder {
    const ss = Object.assign({}, this._selectors, { query, opts });
    return new QueryBuilder(this._db$, ss);
  }

  selectOne(query: Object = {}, opts: Object = {}): QueryBuilder {
    const ss = Object.assign({}, this._selectors, {
      query: query,
      opts: opts,
      limit: 1
    });
    return new QueryBuilder(this._db$, ss);
  }

  sort(sort: Object): QueryBuilder {
    const ss = Object.assign({}, this._selectors, { sort });
    return new QueryBuilder(this._db$, ss);
  }

  skip(offset: number): QueryBuilder {
    const ss = Object.assign({}, this._selectors, { offset });
    return new QueryBuilder(this._db$, ss);
  }

  limit(limit: number = 0): QueryBuilder {
    const ss = Object.assign({}, this._selectors, { limit });
    return new QueryBuilder(this._db$, ss);
  }

  exec(): Observable {
    const ss = this._selectors;
    let db$ = this._db$

    if (!ss.collection) return Observable.throw('You have to provide collection name.');
    if (!db$) return Observable.throw('No db connection found.');

    let o = db$
      .flatMapLatest(db => {
        const c = db.collection(ss.collection);
        const cursor = c.find(ss.query, ss.opts).sort(ss.sort).skip(ss.offset).limit(ss.limit);
        const obs = Observable.fromNodeCallback(cursor.toArray, cursor);
        return obs();
      })
      .finally(() => {
        this._db$ = null;
        this._selectors = null;
      });

    return ss.limit === 1 ? o.map(res => res[0]) : o;
  }
}

export default QueryBuilder.connect(dbUrl);