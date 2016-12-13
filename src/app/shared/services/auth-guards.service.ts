import { Injectable, Inject } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthGuardsService implements CanLoad, CanActivate {

  constructor(
    private userService: UserService,
    @Inject('isBrowser') private isBrowser) { }

  canLoad() {
    if (this.isBrowser) {
      return this.userService.loginStatusRxx;
    } else {
      return Observable.of(false);
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isBrowser) {
      return this.userService.loginStatusRxx;
    } else {
      return Observable.of(false);
    }
  }
}
