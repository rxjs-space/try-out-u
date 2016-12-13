/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuardsService } from './auth-guards.service';
import { UserService } from '../../shared/services/user.service';
import { UserServiceMock } from '../../shared/services/user.service.mock';

describe('AuthGuardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardsService,
        {provide: UserService, useValue: UserServiceMock},
        {provide: 'isBrowser', useValue: true},
      ]
    });
  });

  it('should ...', inject([AuthGuardsService], (service: AuthGuardsService) => {
    expect(service).toBeTruthy();
  }));
});
