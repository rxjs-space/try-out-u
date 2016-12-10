import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';

import { HelpersService } from './helpers.service';


@Injectable()
export class UserService {
  // private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&redirect_uri=http://localhost:4200`;
  private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&redirect_uri=http://localhost:4200`;
  private _loginUrlRxx: BehaviorSubject<any> = new BehaviorSubject(this._ghAuthUrlPre);
  private _ghCode: BehaviorSubject<string> = new BehaviorSubject(null);
  private _loginStatusRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // '-1' is not logged-in, 0 is logging-in, 1 is logged-in

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private helpers: HelpersService,
    @Inject('GhAuth') private ghAuth,
    @Inject('isBrowser') private isBrowser) {

      if (isBrowser) { // if in browser, and not logged in
      // at each NavigationEnd, check if there's query['code'],
        // true: push the code to this._ghCode, then trigger the log-in process; and redirect to url without query['code']
        // false: update the href for log-in anchor, so once click on the anchor, we know where to redirec

        this._loginStatusRxx
          .filter(v => !v) // only check the query['code'] when not logged in (v === false)
          .switchMap(() => {
            return this.router.events
              .filter(event => event instanceof NavigationEnd)
              .map(event => {
                const url = this.router.url;
                const urlTree = this.router.parseUrl(url);
                if (urlTree.queryParams['code']) {
                  const code = urlTree.queryParams['code'];
                  this._ghCode.next(code); // push the ghCode to BehaviorSubject
                  const redirectUrlTree = Object.assign({}, urlTree);
                  delete redirectUrlTree.queryParams['code']; // remove the ghCode for redirect
                  redirectUrlTree.queryParams['loggingIn'] = 'true'; // set loggingIn queryParam for login component
                  this.router.navigateByUrl(this.router.serializeUrl(redirectUrlTree));
                } else {
                  this._loginUrlRxx.next(this._ghAuthUrlPre + url);
                }
              });
          }).subscribe();

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
            const mySiteToken = res.text();
            // and save mySiteToken to localStorage
            const userInfo = helpers.parseJwt(mySiteToken);
            console.log(userInfo);
          }, err => {       // if login failed...
            console.log(err);
          });

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

  login() {
      console.log(`${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&state=${this.ghAuth.cstate}`);
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
