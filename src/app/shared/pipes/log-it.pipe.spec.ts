/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogItPipe } from './log-it.pipe';
import { LogService } from '../services/log.service';

describe('LogItPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogService,
        {provide: 'isProd', useValue: true}
      ]
    });
  });

  it('create an instance', inject([LogService, 'isProd'], (service: LogService, isProd: 'isProd') => {
    let pipe = new LogItPipe(service, isProd);
    expect(pipe).toBeTruthy();
  }));
});
