import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/startWith';

@Injectable()
export class AjaxService {
  ajaxCache: Map<any, any> = new Map();

  constructor(
    @Inject('isBrowser') private isBrowser,
    private http: Http) { }

  getNothing() {
    return this.http.get('/api/auth/nothing').retry(3);
  }

  getGhAuth() {
    return this.http.get('/api/auth/gh-auth-info').retry(3);
  }

  processCode(code) {
    return this.http.get(`/api/auth/?code=${code}`).retry(3);
  }

  getArticleHtml() {
    if (this.isBrowser) {
      const headers = new Headers({'Accept': 'application/vnd.github.VERSION.html'});
      const options = new RequestOptions({ headers });
      const url = `https://api.github.com/repos/rxjs-space/ngcnblog/contents/ngEasy.md?ref=master`;
      // ur will be a parameter or composed by parameter
      if (this.ajaxCache.get(url)) {
        return Observable.of(this.ajaxCache.get(url));
      } else {
        return this.http.get(url, options)
          .map(res => res.text())
          .map(html => {
            const pre = 'https://raw.githubusercontent.com/rxjs-space/ngcnblog/master';
            // no '/' at the end of pre
            const processedHtml = html.replace(/src=["]\.(.+?)["]/g, `src=\"${pre}\$1\"`)
              .replace(/href=["]\.(.+?)["]/g, `href=\"${pre}\$1\"`);
            this.ajaxCache.set(url, processedHtml)
            return processedHtml;
          })
          .startWith('loading article ... ');
      }
    } else {
      return Observable.of('loading article ...');
    }

// str.replace(/src=["](\..+?)["]/, "src=\"\$1\"")
//str.match(/src=["]\..+?["]/)

      // https://raw.githubusercontent.com/rxjs-space/ngcnblog/master/trends.png
  }
  
  /*
GET https://api.github.com/repos/rxjs-space/ngcnblog/contents/ngEasy.md?ref=master HTTP/1.1
Host: api.github.com
Accept: application/vnd.github.VERSION.html
Cache-Control: no-cache
Postman-Token: e03cf13a-47aa-9b4b-1b63-35ca9667eee0
*/


}
