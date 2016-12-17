import {
  AfterContentChecked,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  trigger, state, style, transition, animate, keyframes
} from '@angular/core';

import {isString} from '../util/util';

import {NgbAccordionConfig} from './accordion-config';

let nextId = 0;

/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
@Directive({selector: 'template[ngbPanelTitle]'})
export class NgbPanelTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap accordion panel content.
 */
@Directive({selector: 'template[ngbPanelContent]'})
export class NgbPanelContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * The NgbPanel directive represents an in individual panel with the title and collapsible
 * content
 */
@Directive({selector: 'ngb-panel'})
export class NgbPanel {
  /**
   * Defines if the tab control is focused
   */
  focused: boolean = false;

  /**
   *  A flag determining whether the panel is disabled or not.
   *  When disabled, the panel cannot be toggled.
   */
  @Input() disabled = false;

  /**
   *  An optional id for the panel. The id should be unique.
   *  If not provided, it will be auto-generated.
   */
  @Input() id = `ngb-panel-${nextId++}`;

  /**
   *  The title for the panel.
   */
  @Input() title: string;

  /**
   *  Accordion's types of panels to be applied per panel basis.
   *  Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;

  @ContentChild(NgbPanelContent) contentTpl: NgbPanelContent;
  @ContentChild(NgbPanelTitle) titleTpl: NgbPanelTitle;
}

/**
 * The payload of the change event fired right before toggling an accordion panel
 */
export interface NgbPanelChangeEvent {
  /**
   * Id of the accordion panel that is toggled
   */
  panelId: string;

  /**
   * Whether the panel will be opened (true) or closed (false)
   */
  nextState: boolean;

  /**
   * Function that will prevent panel toggling if called
   */
  preventDefault: () => void;
}

/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only panel can be opened at a time.
 */
@Component({
  selector: 'ngb-accordion',
  exportAs: 'ngbAccordion',
  host: {'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels'},
  template: `
    <div class="card">
      <template ngFor let-panel [ngForOf]="panels">
        <div role="tab" id="{{panel.id}}-header" [attr.aria-selected]="panel.focused"
          [class]="'card-header ' + (panel.type ? 'card-'+panel.type: type ? 'card-'+type : '')" [class.active]="isOpen(panel.id)">
          <a href (click)="!!toggle(panel.id)" (focus)="panel.focused = true" 
            (blur)="panel.focused = false" [class.text-muted]="panel.disabled" 
            [attr.aria-expanded]="isOpen(panel.id)" [attr.aria-controls]="panel.id">
            {{panel.title}}
            <template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></template>
          </a>
        </div>
        <div 
          [@panelContentState]="isOpen(panel.id) ? 'expanded' : 'collapsed'"
          *ngIf="!panel.disabled"
          id="{{panel.id}}" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'" class="card-block"
        >
          <template [ngTemplateOutlet]="panel.contentTpl.templateRef"></template>
        </div>
      </template>
    </div>
  `,
  animations: [
    trigger('panelContentState', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        padding: '20px',
        transform: 'scale(1) rotateX(0)',
      })),
      state('collapsed', style({
        height: 0,
        opacity: 0,
        padding: '0 20px',
        transform: 'scale(0.9) rotateX(-90deg)',
        'display': 'none'
      })),
      transition('expanded => collapsed', [
        animate('0.5s ease-out', keyframes([
          style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 0}),
          style({height: '*', opacity: '0.7', padding: '14px 20px', transform: 'scale(0.97) rotateX(-36deg)', offset: 0.4}),
          style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 0', display: 'none', offset: 1})
        ]))
      ]),
      transition('collapsed => expanded', [
        animate('0.5s ease-in-out', keyframes([
          style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 30%', display: 'none', offset: 0}),
          style({height: '*', opacity: '0.3', padding: '6px 20px', transform: 'scale(0.93) rotateX(-63deg)', offset: 0.3}),
          style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 1})
        ]))
      ]),
    ])
  ]
})
export class NgbAccordion implements AfterContentChecked {
  /**
   * A map that stores each panel state
   */
  private _states: Map<string, boolean> = new Map<string, boolean>();

  /**
   * A map that stores references to all panels
   */
  private _panelRefs: Map<string, NgbPanel> = new Map<string, NgbPanel>();

  @ContentChildren(NgbPanel) panels: QueryList<NgbPanel>;

  /**
   * An array or comma separated strings of panel identifiers that should be opened
   */
  @Input() activeIds: string | string[] = [];

  /**
   *  Whether the other panels should be closed when a panel is opened
   */
  @Input('closeOthers') closeOtherPanels: boolean;

  /**
   *  Accordion's types of panels to be applied globally.
   *  Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;

  /**
   * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
   */
  @Output() panelChange = new EventEmitter<NgbPanelChangeEvent>();

  constructor(config: NgbAccordionConfig) {
    this.type = config.type;
    this.closeOtherPanels = config.closeOthers;
  }

  /**
   * Programmatically toggle a panel with a given id.
   */
  toggle(panelId: string) {
    const panel = this._panelRefs.get(panelId);

    if (panel && !panel.disabled) {
      const nextState = !this._states.get(panelId);
      let defaultPrevented = false;

      this.panelChange.emit(
          {panelId: panelId, nextState: nextState, preventDefault: () => { defaultPrevented = true; }});

      if (!defaultPrevented) {
        this._states.set(panelId, nextState);

        if (this.closeOtherPanels) {
          this._closeOthers(panelId);
        }
        this._updateActiveIds();
      }
    }
  }

  ngAfterContentChecked() {
    // active id updates
    if (isString(this.activeIds)) {
      this.activeIds = (this.activeIds as string).split(/\s*,\s*/);
    }
    this._updateStates();

    // closeOthers updates
    if (this.activeIds.length > 1 && this.closeOtherPanels) {
      this._closeOthers(this.activeIds[0]);
      this._updateActiveIds();
    }
  }

  /**
   * @internal
   */
  isOpen(panelId: string): boolean { const x = this._states.get(panelId); /*console.log(x); */return x;}

  private _closeOthers(panelId: string) {
    this._states.forEach((state, id) => {
      if (id !== panelId) {
        this._states.set(id, false);
      }
    });
  }

  private _updateActiveIds() {
    this.activeIds =
        this.panels.toArray().filter(panel => this.isOpen(panel.id) && !panel.disabled).map(panel => panel.id);
  }

  private _updateStates() {
    this._states.clear();
    this._panelRefs.clear();
    this.panels.toArray().forEach((panel) => {
      this._states.set(panel.id, this.activeIds.indexOf(panel.id) > -1 && !panel.disabled);
      this._panelRefs.set(panel.id, panel);
    });
  }
  
}
