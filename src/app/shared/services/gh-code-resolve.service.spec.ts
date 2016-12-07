/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GhCodeResolveService } from './gh-code-resolve.service';

describe('GhCodeResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GhCodeResolveService]
    });
  });

  it('should ...', inject([GhCodeResolveService], (service: GhCodeResolveService) => {
    expect(service).toBeTruthy();
  }));
});
