import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { tokenNotExpired } from 'angular2-jwt';

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
        this.route.queryParams.subscribe(console.log);
        this.route.url.subscribe(console.log);
        this._loginStatusRxx
          .filter(v => !v) // only check the query['code'] when not logged in (v === false)
          .switchMap(() => {
            return this.router.events
              .filter(event => event instanceof NavigationEnd)
              .map(event => {
                console.log(this.router.routerState);
                const url = this.router.routerState.snapshot.url;
                const regex = /[?&](code=.+)/; // assuming that code is at the end of the url
                const matched = url.match(regex);
                if (matched && matched[1]) {
                  this._ghCode.next(matched[1].substring(5)); // push the gh code to BehaviorSubject
                  let redirUrl;
                  switch (true) {
                    case matched && matched[0].indexOf('?') !== -1:
                      redirUrl = url.substring(0, url.indexOf('?'));
                      break;
                    case matched && matched[0].indexOf('&') !== -1:
                      redirUrl = url.substring(0, url.indexOf(matched[0]));
                      break;
                  }
                  this.router.navigateByUrl(redirUrl);
                } else {
                  this._loginUrlRxx.next(this._ghAuthUrlPre + url);
                }
              });
          }).subscribe();

        // each time receiving a new ghCode, go to backend,
        // the backend will use to code to get access_token and user info and login
        this._ghCode.filter(code => Boolean(code))
          .switchMap(code => {
            return this.http.get(`/api/auth/?code=${code}`);
          })
          .subscribe(res => { // if login success...
            this._loginStatusRxx.next(true);
            const userInfo = helpers.parseJwt(res.text());
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

  get logginIn() {
    return this.isBrowser ? Boolean(localStorage.getItem('loggingIn')) : false;
  }

  set loggingIn(v) {
    localStorage.setItem('loggingIn', (true).toString());
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
