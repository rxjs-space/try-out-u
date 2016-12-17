import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PanelState } from '../tl-accordion.interface';

@Component({
  selector: 'tl-accordion-panel',
  templateUrl: './tl-accordion-panel.component.html',
  styleUrls: ['./tl-accordion-panel.component.scss']
})
export class TlAccordionPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  stateRxx: Subject<PanelState> = new Subject();
  self = this;

  constructor() { }

  ngOnInit() {
  }

}
