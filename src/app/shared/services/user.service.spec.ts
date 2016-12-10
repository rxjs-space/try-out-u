/* tslint:disable:no-unused-variable */

import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
const ghAuth = environment.ghAuth;
import { HelpersService } from './helpers.service';
import { isBrowser, isNode } from 'angular2-universal/browser/browser';
import { RouterTestingModule } from '@angular/router/testing';


describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        UserService,
        { provide: 'GhAuth', useValue: ghAuth },
        HelpersService,
        { provide: 'isBrowser', useValue: isBrowser },
        { provide: 'isNode', useValue: isNode },
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
