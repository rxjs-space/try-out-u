import { Component, OnInit, ContentChildren, QueryList, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { TlAccordionPanelComponent } from './tl-accordion-panel/tl-accordion-panel.component';

import { PanelState, PanelStateRxx } from './tl-accordion.interface';

@Component({
  selector: 'tl-accordion',
  templateUrl: './tl-accordion.component.html',
  styleUrls: ['./tl-accordion.component.scss'],
  changeDetection: 0
})
export class TlAccordionComponent implements OnInit {
  @Input() showOneOnly: boolean = false;
  @ContentChildren(TlAccordionPanelComponent) panels: QueryList<TlAccordionPanelComponent>;
  lastExpandedAtPanel: TlAccordionPanelComponent = null;
  constructor() { }

  ngOnInit() {

  }
  ngAfterContentInit() {
    if (this.showOneOnly) {
      this.lastExpandedAtPanel = this.panels.filter(panel => panel.expanded === true)[0];
      const panelStateRxxArr: PanelStateRxx[] = this.panels.map(panel => panel.stateRxx);
      const mergedPanelStatesRx: Observable<PanelState> = Observable.merge(...panelStateRxxArr);
      mergedPanelStatesRx
        .filter(panelState => panelState.expanded === true && this.lastExpandedAtPanel !== panelState.self)
        .do(panelState => {
          this.lastExpandedAtPanel.expanded = false;
          this.lastExpandedAtPanel = panelState.self;
        })
        .subscribe();



    }
  }
  ngAfterContentChecked() {
    
  }

}
