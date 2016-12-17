import { TlAccordionPanelComponent } from './tl-accordion-panel/tl-accordion-panel.component';
import { Subject } from 'rxjs/Subject';

export interface PanelState {
  self: TlAccordionPanelComponent;
  expanded: boolean;
}

export type PanelStateRxx = Subject<PanelState>;