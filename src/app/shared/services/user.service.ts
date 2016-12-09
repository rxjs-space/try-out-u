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


@Injectable()
export class UserService {
  // private _ghAuthUrl = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&state=${this.ghAuth.cstate}&redirect_uri=`;
  // private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}&redirect_uri=http://localhost:4200`;
  private _ghAuthUrlPre = `${this.ghAuth.baseUrl}?client_id=${this.ghAuth.cid}`;
  private _loginUrlRxx: BehaviorSubject<any> = new BehaviorSubject(this._ghAuthUrlPre);
  private _ghCode: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('GhAuth') private ghAuth,
    @Inject('isBrowser') private isBrowser) {

      if (isBrowser) {
        this.router.events
          .filter(event => event instanceof NavigationEnd)
          .map(event => {
            const url = this.router.routerState.snapshot.url;
            const regex = /[?&](code=.+)/; // assuming that code is at the end of the url
            const matched = url.match(regex);
            // if gh code is in the url, remove the code and redirect
            // for example, if we have http://localhost:4200?code=xxx, 
            // we will be redirected to http://localhost:4200, without 'code=xxx'.
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
              this._loginUrlRxx.next(this._ghAuthUrlPre + url)
            }
          }).subscribe();

        // each time the ghCode changes, go to backend
        // the backend will use to code to get access_token and user info and login
        this._ghCode.filter(code => Boolean(code))
          .switchMap(code => {
            // console.log(code);
            return this.http.get(`/api/auth/ghtoken?code=${code}`);
          })
          .subscribe(d => {
            try {
              console.log(d.json());
            } catch (e) {
              console.log(d.text());
            }
          });

      }

   }

  get myTokenAlive() {
    return tokenNotExpired();
  }

  get loginUrlRxx() {
    return this._loginUrlRxx;
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
