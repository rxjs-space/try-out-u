/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';


import { PlatformCommonComponent } from './platform-common.component';
import { LoginComponent } from './login/login.component';

// import { SharedModule } from '../shared/shared.module';
import { UserService } from '../shared/services/user.service';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { environment } from '../../environments/environment';
const ghAuth = environment.ghAuth;
import { HelpersService } from '../shared/services/helpers.service';
import { isBrowser, isNode } from 'angular2-universal/browser/browser';


describe('PlatformCommonComponent', () => {
  let component: PlatformCommonComponent;
  let fixture: ComponentFixture<PlatformCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ PlatformCommonComponent, LoginComponent ],
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
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
