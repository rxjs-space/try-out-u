/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlAccordionrComponent } from './tl-accordionr.component';

describe('TlAccordionrComponent', () => {
  let component: TlAccordionrComponent;
  let fixture: ComponentFixture<TlAccordionrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlAccordionrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlAccordionrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
