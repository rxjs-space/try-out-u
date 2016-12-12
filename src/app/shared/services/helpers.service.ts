import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../platform-common/platform-common-routing.module';


@Injectable()
export class HelpersService {

  constructor(
    /*@Inject('isBrowser') private isBrowser,
    private router: Router*/) {

    // if (!isBrowser) {
    //   this.router.resetConfig(this.noLazyRoutes(routes));
    // }
  }

  parseJwt(token, segmentId) {
    const base64Url = token.split('.')[segmentId];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  // noLazyRoutes(routes: any[]) {
  //   let newRoutes = [];
  //   for (let r of routes) {
  //     if (r.loadChildren) {
  //       r.loadChildren = r.syncChildren;
  //       // console.log(r.loadChildren);
  //     }
  //     if (r.children) {
  //       let newR = Object.assign({}, r);
  //       newR.children = this.noLazyRoutes(newR.children);
  //       newRoutes.push(newR);
  //     } else {
  //       newRoutes.push(r);
  //     }
  //   }
  //   return newRoutes;
  // }

}
