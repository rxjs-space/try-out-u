/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlAccordionrConfigService } from './tl-accordionr-config.service';

describe('TlAccordionrConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlAccordionrConfigService]
    });
  });

  it('should ...', inject([TlAccordionrConfigService], (service: TlAccordionrConfigService) => {
    expect(service).toBeTruthy();
  }));
});
