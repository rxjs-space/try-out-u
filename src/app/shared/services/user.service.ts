import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
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

import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  // private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&redirect_uri=http://localhost:4200`;
  private _ghCode: BehaviorSubject<string> = new BehaviorSubject(null);
  private _loginStatusRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // '-1' is not logged-in, 0 is logging-in, 1 is logged-in
  private _loggingInRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loginUrlRxx: BehaviorSubject<string> = new BehaviorSubject(null);
  private _ghAuth: any;
  private _userInfoRxx: BehaviorSubject<any> = new BehaviorSubject(null);
  private _mySiteTokenRxx: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private helpers: HelpersService,
    @Inject('isBrowser') private isBrowser) {

      // check if 'logging in'
      this._loginStatusRxx
        .switchMap((loginStatus) => {
          if (loginStatus) {
            return Observable.of(false);
          } else {
            return this.route.queryParams
              .filter(queryParams => queryParams['code'] || queryParams['loggingIn'])
              .map(() => true);
          }
        })
        .subscribe(this._loggingInRxx);


      if (isBrowser) {
        // queryParams with code or loggingIn
        if (this.tokenNotExpired()) {
          this._loginStatusRxx.next(true);
        }
        this._loginStatusRxx
          .filter(v => !v) // if loginStatus is false, do following
          .switchMap(() => this.generateAndUpdateLoginUrl())
          .subscribe();

        this.codeSubscription();
      }
   }

  private generateAndUpdateLoginUrl(): Observable<any> {
    return this.route.queryParams
      .switchMap(queryParams => {
        if (queryParams['code']) {
          return this.dealWithCode(queryParams['code']);
        } else {
          return this.setGhAuthUrlRx(); // will set login anchor's href at client render
        }
      });
   }

  private dealWithCode(code) { // remove code queryParam from url and send code to backend

    const url = this.router.url;
    const urlTree = this.router.parseUrl(url);
    const redirectUrlTree = Object.assign({}, urlTree);
    delete redirectUrlTree.queryParams['code']; // remove the ghCode for redirect
    redirectUrlTree.queryParams['loggingIn'] = 'true'; // set loggingIn queryParam for login component
    this.router.navigateByUrl(this.router.serializeUrl(redirectUrlTree));

    this._ghCode.next(code); // push the ghCode to BehaviorSubject
    return Observable.of('will process with code');
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
      return this.http.get('/api/auth/gh-auth-info')
        .map(res => {
          this._ghAuth = res.json();
          return this._ghAuth;
        });
    }
  }

  private codeSubscription() {
    // each time receiving a new ghCode, go to backend,
    this._ghCode.filter(code => Boolean(code))
      .switchMap(code => {
        return this.http.get(`/api/auth/?code=${code}`);
        // the backend will use to code to get gh access_token and gh user info and compare/save to db and generate my_jwt
      })
      .subscribe(res => { // if login success...
        // remove queryParams['loggingIn']
        const urlTree = this.router.parseUrl(this.router.url);
        if (urlTree.queryParams['loggingIn']) {
          const redirectUrlTree = Object.assign({}, urlTree);
          delete redirectUrlTree.queryParams['loggingIn'];
          this.router.navigateByUrl(this.router.serializeUrl(redirectUrlTree));
        }
        this._loginStatusRxx.next(true);
        this._loggingInRxx.next(false);
        const mySiteToken = res.text();
        localStorage.setItem('mySiteToken', mySiteToken); // save the token to localStorage
        const userInfo = this.helpers.parseJwt(mySiteToken, 1);
        console.log(userInfo);
        this._userInfoRxx.next(userInfo);
      }, err => {       // if login failed...
        console.log(err);
      });
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

  // get myTokenAlive() {
  //   return tokenNotExpired();
  // }

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

  logout() {

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
