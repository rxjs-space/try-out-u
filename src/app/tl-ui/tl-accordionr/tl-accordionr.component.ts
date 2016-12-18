import { Component, OnInit, Input, } from '@angular/core';
import { TlAccordionrConfigService } from './tl-accordionr-config.service';
import { Panel } from './tl-accordionr.interface';
@Component({
  selector: 'tl-accordionr',
  templateUrl: './tl-accordionr.component.html',
  styleUrls: ['./tl-accordionr.component.scss'],
  changeDetection: 0
})
export class TlAccordionrComponent implements OnInit {
  @Input() private expandOneOnly: boolean;
  @Input() private panels: Panel[];
  private lastExpandedPanel: Panel;
  constructor(private config: TlAccordionrConfigService) { }

  ngOnInit() {
    // init expandOneOnly
    if (typeof this.expandOneOnly === 'undefined') {
      this.expandOneOnly = this.config.expandOneOnly;
    }
    // init lastExpandedPanel
    if (this.panels.length && this.panels.length > 0) {
      const lastExpandedPanels = this.panels.filter(panel => panel.expanded);
      this.lastExpandedPanel = lastExpandedPanels[0];
    }
  }

  onPanelClick(panel: Panel) {
    if (!panel.disabled) {
      panel.expanded = !panel.expanded;
      if (this.lastExpandedPanel !== panel && this.expandOneOnly) {
        this.lastExpandedPanel.expanded = false;
        this.lastExpandedPanel = panel;
      }
    }
  }

}
