/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AjaxService } from './ajax.service';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';


describe('AjaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AjaxService,
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

  it('should ...', inject([AjaxService], (service: AjaxService) => {
    expect(service).toBeTruthy();
  }));
});
