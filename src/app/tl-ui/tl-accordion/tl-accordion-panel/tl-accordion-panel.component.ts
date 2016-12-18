import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PanelState } from '../tl-accordion.interface';

@Component({
  selector: 'tl-accordion-panel',
  templateUrl: './tl-accordion-panel.component.html',
  styleUrls: ['./tl-accordion-panel.component.scss']
})
export class TlAccordionPanelComponent {
  @Input() disabled: boolean = false;
  @Input() expanded: boolean = false;
  stateRxx: Subject<PanelState> = new Subject();
  constructor() { }
}
