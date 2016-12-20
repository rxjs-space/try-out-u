import { Component, OnInit, Input, Optional} from '@angular/core';
import { TlAccordionrConfigService } from './tl-accordionr-config.service';
import { Panel } from './tl-accordionr.interface';
import { accordinrAnimations } from './tl-accordionr.component.animation';
@Component({
  selector: 'tl-accordionr',
  templateUrl: './tl-accordionr.component.html',
  styleUrls: ['./tl-accordionr.component.scss'],
  changeDetection: 0,
  animations: accordinrAnimations
})
export class TlAccordionrComponent implements OnInit {
  @Input() private expandOneOnly: boolean;
  @Input() private panels: Panel[] = [];
  private lastExpandedPanel: Panel;
  constructor(@Optional() private config: TlAccordionrConfigService) {
    if (!this.config) {
      this.config = <TlAccordionrConfigService>{
        expandOneOnly: false,
        animation: true
      };
    }
  }

  ngOnInit() {
    // init expandOneOnly
    if (typeof this.expandOneOnly === 'undefined') {
      this.expandOneOnly = this.config.expandOneOnly;
    }
    // init lastExpandedPanel
    if (this.panels.length > 0) {
      const lastExpandedPanels = this.panels.filter(panel => panel.expanded);
      this.lastExpandedPanel = lastExpandedPanels[0];
    }
  }

  onTitleClick(event: any, panel: Panel) {
    if (typeof event !== 'undefined' && event.preventDefault) {
      event.preventDefault();
    }
    if (!panel.disabled) {
      panel.expanded = !panel.expanded;
      if (this.lastExpandedPanel !== panel && this.expandOneOnly) {
        this.lastExpandedPanel.expanded = false;
        this.lastExpandedPanel = panel;
      }
    }
  }

}
