import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {

  constructor() { }

  parseJwt(token, segmentId) {
    const base64Url = token.split('.')[segmentId];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

}
