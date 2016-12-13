import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { environment } from '../../../environments/environment';

@Injectable()
export class AjaxServiceMock {

  constructor(private http: Http) { }

  getNothing() {
    return Observable.of({text: () => 'nothing'});
  }

  getGhAuth() {
    return Observable.of({json: () => environment.ghAuth});
  }

  processCode(code) {
    return Observable.of({text: () => 'token'});
  }
}
