/* tslint:disable:no-unused-variable */

import { By } from '@angular/platform-browser';
import { Component, ElementRef, Renderer, HostListener } from '@angular/core';
import { TestBed, async, inject  } from '@angular/core/testing';
import { ToggleClassDirective } from './toggle-class.directive';

@Component({
  template: `
  <h2 appToggleClass="x"></h2>`
})
class TestComponent { }

describe('ToggleClassDirective', () => {

  let fixture, des, bareH2;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ ToggleClassDirective, TestComponent ]
    })
    .createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
    // all elements with an attached HighlightDirective
    des = fixture.debugElement.queryAll(By.directive(ToggleClassDirective));
    // the h2 without the HighlightDirective
    // bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));
  });

  it('should have one classed element', () => {
    expect(des.length).toBe(1);
  });

  it('should class the h2 as "x"', () => {
    des[0].triggerEventHandler('click', {button: 0});
    const classX = des[0].classes['x'];
    expect(classX).toBe(true);
  });

  // fit('should create an instance', inject([ElementRef, Renderer], (element: ElementRef, renderer: Renderer) => {
  //   let directive = new ToggleClassDirective(element, renderer);
  //   expect(directive).toBeTruthy();
  // }));
});
