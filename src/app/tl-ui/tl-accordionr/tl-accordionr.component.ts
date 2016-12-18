import { Component, OnInit, Input, } from '@angular/core';

import { Panel } from './tl-accordionr.interface';
@Component({
  selector: 'tl-accordionr',
  templateUrl: './tl-accordionr.component.html',
  styleUrls: ['./tl-accordionr.component.scss']
})
export class TlAccordionrComponent implements OnInit {
  @Input() private expandOneOnly: boolean = false;
  @Input() private panels: Panel[] = [];
  constructor() { }

  ngOnInit() {
  }

}
