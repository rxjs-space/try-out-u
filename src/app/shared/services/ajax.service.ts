import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class AjaxService {

  constructor(private http: Http) { }

  getNothing() {
    return this.http.get('/api/auth/nothing');
  }

  getGhAuth() {
    return this.http.get('/api/auth/gh-auth-info');
  }

  processCode(code) {
    return this.http.get(`/api/auth/?code=${code}`);
  }
}
