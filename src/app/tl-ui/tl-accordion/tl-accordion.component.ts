import { Component, ContentChildren, QueryList, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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
export class TlAccordionComponent {
  @Input() public expandOneOnly: boolean = false;
  @ContentChildren(TlAccordionPanelComponent) private panels: QueryList<TlAccordionPanelComponent>;
  private lastExpandedAtPanel: TlAccordionPanelComponent = null;
  private subscriptions: Subscription[] = []; // to unsubscribe in ngDestroy
  constructor() { }
  ngAfterContentInit() {
    if (this.expandOneOnly) {
      // initialize this.lastExpandedAtPanel
      const expandedPanelsInTemplate = this.panels.filter(panel => panel.expanded === true);
      if (expandedPanelsInTemplate.length > 1) {
        console.log(`
Warning: accordion.expandOneOnly is true, while there are more than one panel is expanded in template. \
Will keep the first expanded panel as expanded and collapse the rest.
        `);
        expandedPanelsInTemplate.forEach((panel, index) => {
          if (index > 0) {panel.expanded = false;};
        })
      }
      this.lastExpandedAtPanel = expandedPanelsInTemplate[0];

      // subscribe to mergedPanelStatesRx
      const panelStateRxxArr: PanelStateRxx[] = this.panels.map(panel => panel.stateRxx);
      const mergedPanelStatesRx: Observable<PanelState> = Observable.merge(...panelStateRxxArr);
      const subscription = mergedPanelStatesRx
        .filter(panelState => panelState.expanded === true && this.lastExpandedAtPanel !== panelState.panel)
        .do(panelState => {
          this.lastExpandedAtPanel.expanded = false;
          this.lastExpandedAtPanel = panelState.panel;
        })
        .subscribe();
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
