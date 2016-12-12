import { Injectable, Inject } from '@angular/core';
import { CanLoad } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthGuardsService implements CanLoad {

  constructor(
    private userService: UserService,
    @Inject('isBrowser') private isBrowser) { }

  canLoad() {
    if (this.isBrowser) {
      return this.userService.tokenNotExpired();
    } else {
      return true;
    }
  }
}
