/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlLearnComponent } from './tl-learn.component';

describe('TlLearnComponent', () => {
  let component: TlLearnComponent;
  let fixture: ComponentFixture<TlLearnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlLearnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
