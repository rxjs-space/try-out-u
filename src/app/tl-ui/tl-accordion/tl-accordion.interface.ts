import { TlAccordionPanelComponent } from './tl-accordion-panel/tl-accordion-panel.component';
import { Subject } from 'rxjs/Subject';

export interface PanelState {
  panel: TlAccordionPanelComponent;
  expanded: boolean;
}

export type PanelStateRxx = Subject<PanelState>;
