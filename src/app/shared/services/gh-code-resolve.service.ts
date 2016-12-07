import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class GhCodeResolveService implements Resolve<string>, CanActivateChild {

  constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<any> {
    // console.log('at resolve');
    return Observable.of('a');
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // console.log(route.params);
    return Observable.of(true);
  }

}
