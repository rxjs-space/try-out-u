import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlAccordionComponent } from './tl-accordion.component';
import { TlAccordionPanelComponent } from './tl-accordion-panel/tl-accordion-panel.component';
import { TlAccordionPanelTitleComponent } from './tl-accordion-panel-title/tl-accordion-panel-title.component';
import { TlAccordionPanelContentComponent } from './tl-accordion-panel-content/tl-accordion-panel-content.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAccordionComponent, TlAccordionPanelComponent, TlAccordionPanelTitleComponent, TlAccordionPanelContentComponent],
  exports: [TlAccordionComponent, TlAccordionPanelComponent, TlAccordionPanelTitleComponent, TlAccordionPanelContentComponent]
})
export class TlAccordionModule { }
