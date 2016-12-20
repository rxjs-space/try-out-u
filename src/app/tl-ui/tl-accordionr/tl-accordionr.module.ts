import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlAccordionrComponent } from './tl-accordionr.component';
import { TlAccordionrConfigService } from './tl-accordionr-config.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAccordionrComponent],
  exports: [TlAccordionrComponent],
})
export class TlAccordionrModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlAccordionrModule,
      providers: [TlAccordionrConfigService]
    }
  }
}
