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
  private _ghAuthUrlPre: string;
  private _loginUrlRxx: BehaviorSubject<any> = new BehaviorSubject(null);
  private _loggingInRxx: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private helpers: HelpersService,
    @Inject('isBrowser') private isBrowser) {
      this.route.queryParams
        .filter(queryParams => queryParams['code'] || queryParams['loggingIn'])
        .subscribe(() => {
          this._loggingInRxx.next(true);
        });

      if (!isBrowser) {
        const ghAuth = environment.ghAuth;
        const redirectRoot = environment.production ? 'https://tryau.herokuapp.com' : 'http://localhost:4200'
        const ghAuthUrlPre = `${ghAuth.baseUrl}?client_id=${ghAuth.cid}&redirect_uri=${redirectRoot}`;
        this._loginUrlRxx.next(ghAuthUrlPre);
      } else {
        // queryParams with code or loggingIn
        this._loginStatusRxx
          .filter(v => !v)
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
        }
        if (queryParams['loggingIn']) {
          return Observable.of('still logging in');;
        }
        return this.getGhAuthInfo();
      })
   }

  private dealWithCode(code) {

    const url = this.router.url;
    const urlTree = this.router.parseUrl(url);
    const redirectUrlTree = Object.assign({}, urlTree);
    delete redirectUrlTree.queryParams['code']; // remove the ghCode for redirect
    redirectUrlTree.queryParams['loggingIn'] = 'true'; // set loggingIn queryParam for login component
    this.router.navigateByUrl(this.router.serializeUrl(redirectUrlTree));

    this._ghCode.next(code); // push the ghCode to BehaviorSubject
    return Observable.of('will process with code');
  }

  private getGhAuthInfo(): Observable<any> {
    return this.http.get('/api/auth/gh-auth-info')
      .map(res => {
        const ghAuth = res.json();
        this._ghAuthUrlPre = `${ghAuth.baseUrl}?client_id=${ghAuth.cid}&redirect_uri=http://localhost:4200`;
        this._loginUrlRxx.next(this._ghAuthUrlPre);
      })
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
        // and save mySiteToken to localStorage
        const userInfo = this.helpers.parseJwt(mySiteToken);
        console.log(userInfo);
      }, err => {       // if login failed...
        console.log(err);
      });
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
    return this._loggingInRxx
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
