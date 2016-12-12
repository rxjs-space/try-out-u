/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuardsService } from './auth-guards.service';

describe('AuthGuardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardsService]
    });
  });

  it('should ...', inject([AuthGuardsService], (service: AuthGuardsService) => {
    expect(service).toBeTruthy();
  }));
});
