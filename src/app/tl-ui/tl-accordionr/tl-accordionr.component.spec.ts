/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlAccordionrComponent } from './tl-accordionr.component';
import { TlAccordionrConfigService } from './tl-accordionr-config.service';
import { Panel } from './tl-accordionr.interface';

@Component({
  template: `
    <tl-accordionr [expandOneOnly]="true" [panels]="panels"></tl-accordionr>`
})
class TestHostComponent {
  panels = [
    {title: '<span>&#9733; <b>Fancy</b> title0 &#9733;</span>', content: 'content0', expanded: true},
    {title: 'title1', content: 'content1'},
    {title: 'title2', content: 'content2', disabled: true},
  ];
}

fdescribe('TlAccordionrComponent', () => {
  let componentHost: TestHostComponent;
  let fixtureHost: ComponentFixture<TestHostComponent>;
  let accordionComponent: TlAccordionrComponent;
  let fixture: ComponentFixture<TlAccordionrComponent>;
  let TlAccordionrConfigServiceStub: TlAccordionrConfigService;
  let accordionEl: DebugElement;

  beforeEach(async(() => {
    TlAccordionrConfigServiceStub = {expandOneOnly: false, animation: true};
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, TlAccordionrComponent ],
      providers: [
        {provide: TlAccordionrConfigService, useValue: TlAccordionrConfigServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixtureHost  = TestBed.createComponent(TestHostComponent);
    componentHost = fixtureHost.componentInstance;
    accordionEl = fixtureHost.debugElement.query(By.css('tl-accordionr'));
    accordionComponent = accordionEl.componentInstance;
    fixtureHost.detectChanges();
  });

  it('should inject the config', () => {
    expect(accordionEl.injector.get(TlAccordionrConfigService)).toEqual(TlAccordionrConfigServiceStub);
 });

  it('should initialize with TestHost setup', () => {
    expect(accordionComponent['expandOneOnly']).toBe(true);
    expect(accordionComponent['panels']).toEqual(componentHost.panels);
    expect(accordionComponent['lastExpandedPanel']).toEqual(componentHost.panels[0]);
  });

  it('should act as expected when click on title', fakeAsync(() => {
    const titleElArr = fixtureHost.debugElement.queryAll(By.css('tl-accordionr .card-header'));
    const contentElArr = fixtureHost.debugElement.queryAll(By.css('tl-accordionr .card-block'));

    expect(accordionComponent['panels'][0].expanded).toBe(true); // [0] is expanded initially
    titleElArr[1].triggerEventHandler('click', {}); // click on [1]
    fixtureHost.detectChanges();
    expect(accordionComponent['panels'][0].expanded).toBe(false); // model [0] is collapsed
    expect(accordionComponent['panels'][1].expanded).toBe(true); // model [1] is expanded

    if (TlAccordionrConfigServiceStub.animation) {tick(500);} // don't know how to set stub.animation during test

    expect(contentElArr[0].styles['display']).toBe('none', 'dom [0] is collapsed, after animation');
    expect(contentElArr[1].styles['display']).toBeNull('dom [1] is style.display is not explicitly set.');
    titleElArr[2].triggerEventHandler('click', {}); // click on [2]
    fixtureHost.detectChanges();
    expect(accordionComponent['panels'][2].expanded).toBeUndefined(); // [2] has not expanded property initially and is disabled
    expect(contentElArr[2]).toBeUndefined(); // disabled content not rendered
  }));



  // beforeEach(() => {
  //   fixture = TestBed.createComponent(TlAccordionrComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // xit('should provide expadOneOnly as configured', () => {
  //   const configServiceInTestBed = TestBed.get(TlAccordionrConfigService);
  //   const configServiceInComponent = fixture.debugElement.injector.get(TlAccordionrConfigService);
  //   expect(configServiceInTestBed).toEqual(TlAccordionrConfigServiceStub, 'configServiceInTestBed is as expected');
  //   expect(configServiceInComponent).toEqual(TlAccordionrConfigServiceStub, 'configServiceInComponent is as expected');
  // });

  // xit('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should initialize properties without inputs', () => {
  //   expect(component['expandOneOnly']).toBe(false, 'expandOneOnly property initialized corretly');
  //   expect(component['panels']).toEqual([], 'panels property initialized corretly');
  //   expect(component['lastExpandedPanel']).toBeUndefined('panels property initialized corretly');
  // });

});
