/* tslint:disable:no-unused-variable */
///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PlatformCommonComponent } from './platform-common/platform-common.component';
import { LoginComponent } from './platform-common/login/login.component';

import { UserService } from './shared/services/user.service';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { environment } from '../environments/environment';
const ghAuth = environment.ghAuth;
import { HelpersService } from './shared/services/helpers.service';
import { isBrowser, isNode } from 'angular2-universal/browser/browser';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        PlatformCommonComponent,
        LoginComponent
      ],
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

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
