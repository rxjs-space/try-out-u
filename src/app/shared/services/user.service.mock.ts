import { Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';

import { HelpersService } from './helpers.service';
import { AjaxServiceMock as AjaxService } from './ajax.service.mock';

import { environment } from '../../../environments/environment';

@Injectable()
export class UserServiceMock {
  // private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&redirect_uri=http://localhost:4200`;
  private _loginStatusRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // '-1' is not logged-in, 0 is logging-in, 1 is logged-in
  private _loggingInRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loginUrlRxx: BehaviorSubject<string> = new BehaviorSubject(null);
  private _ghAuth: any;
  private _userInfoRxx: BehaviorSubject<any> = new BehaviorSubject(null);
  private _mySiteTokenRxx: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private helpers: HelpersService,
    private ajax: AjaxService,
    @Inject('isBrowser') private isBrowser) {

      // check if 'logging in'
      this._loginStatusRxx
        .switchMap((loginStatus) => {
          if (loginStatus) {
            return Observable.of(false);
          } else {
            return this.route.queryParams
              .filter(queryParams => queryParams['code'])
              .map(() => true);
          }
        })
        .subscribe(this._loggingInRxx);


      if (isBrowser) {
        if (this.tokenNotExpired()) { // tokenNotExpired will check localStorage, which node has not
          this._loginStatusRxx.next(true);
        }
        this._loginStatusRxx
          .filter(v => !v) // if loginStatus is false, do following
          .switchMap(() => {
            return this.route.queryParams
            .switchMap(queryParams => {
              if (queryParams['code']) {
                return this.dealWithCode(queryParams['code']); // found code, process login
              } else {
                return this.setGhAuthUrlRx(); // no code, update loginUrl
              }
            });
          })
          .subscribe(() => {}, (e) => console.log(e));
      }
   }


  private dealWithCode(code) { // send code to backend
    this._loggingInRxx.next(true);
    return this.ajax.processCode(code)
      .do(res => { // if login success...
        // remove queryParams['loggingIn']
        const urlTree = this.router.parseUrl(this.router.url);
        if (urlTree.queryParams['code']) {
          const redirectUrlTree = Object.assign({}, urlTree);
          delete redirectUrlTree.queryParams['code'];
          this.router.navigateByUrl(this.router.serializeUrl(redirectUrlTree));
        }
        this._loginStatusRxx.next(true);
        this._loggingInRxx.next(false);
        const mySiteToken = res.text();
        localStorage.setItem('mySiteToken', mySiteToken); // save the token to localStorage
        const userInfo = this.helpers.parseJwt(mySiteToken, 1);
        console.log(userInfo);
        this._userInfoRxx.next(userInfo);
      });
  }

  private setGhAuthUrlRx(): Observable<any> {
    return this.ghAuthRx()
      .switchMap(ghAuth => {
        const redirectRoot = environment.production ? ghAuth.redirectProd : ghAuth.redirectDev;
        const ghAuthUrlPre = `${ghAuth.baseUrl}?client_id=${ghAuth.cid}&redirect_uri=${redirectRoot}`;
        this._loginUrlRxx.next(ghAuthUrlPre + this.router.url);
        return this.router.events
          .filter(event => event instanceof NavigationEnd)
          .map(event => {
            this._loginUrlRxx.next(ghAuthUrlPre + this.router.url);
          });
      });
  }

  private ghAuthRx(): Observable<any> {
    // because the client bundle is generated before process.env is set (in the postinstall script),
    // so we need to http.get the ghAuth (after process.env is set).
    if (this._ghAuth) {
      return Observable.of(this._ghAuth);
    } else {
      return this.ajax.getGhAuth()
        .map(res => {
          this._ghAuth = res.json();
          return this._ghAuth;
        });
    }
  }

  logOut() {
    this._loginStatusRxx.next(false);
    localStorage.removeItem('mySiteToken');
  }

  logIn() {
    this._loggingInRxx.next(true);
  }

  tokenNotExpired() {
    const mySiteToken = localStorage.getItem('mySiteToken');

    if (mySiteToken) {
      const tokenExp = this.helpers.parseJwt(mySiteToken, 1)['exp'];
      // console.log(new Date(tokenExp*1000));
      return tokenExp > (Date.now() / 1000);
    } else {
      this._loginStatusRxx.next(false);
      return false;
    }
  }


  get loginUrlRxx() {
    return this._loginUrlRxx;
  }

  get loginStatusRxx() {
    return this._loginStatusRxx;
  }

  get loggingInRxx() {
    return this._loggingInRxx;
  }

  get userInfoRxx() {
    return this._userInfoRxx;
  }

  get mySiteTokenRxx() {
    return this._mySiteTokenRxx;
  }

  nothing() {
    this.ajax.getNothing()
      .subscribe(console.log);
  }

}


/*

front asks (with jwt in cookie) backend to check if user is logged-in (based on my-site jwt),
  1) true, show username on front page
  2) false, redirect to /api/login
    2.1) redirect (with a random state) to github login, allow sign-up with github
    2.2) after login, get the code, then post to github to get user-info
    2.3) check if user record of my-site exists
      2.3.1) true, go-ahead
      2.3.2) false, store the user-info
    2.4) issue my-site jwt
    2.5) send the jwt to front with http-only flag (and secure flag, if applicable)


*/
