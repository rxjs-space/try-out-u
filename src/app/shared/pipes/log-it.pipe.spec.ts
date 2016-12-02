/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogItPipe } from './log-it.pipe';
import { LogService } from '../services/log.service';

describe('LogItPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService]
    });
  });

  it('create an instance', inject([LogService], (service: LogService) => {
    let pipe = new LogItPipe(service);
    expect(pipe).toBeTruthy();
  }));
});
