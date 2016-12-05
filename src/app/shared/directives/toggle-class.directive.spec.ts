/* tslint:disable:no-unused-variable */

import { ElementRef, Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { ToggleClassDirective } from './toggle-class.directive';

describe('ToggleClassDirective', () => {
  it('should create an instance', inject([ElementRef, Renderer], (element: ElementRef, renderer: Renderer) => {
    let directive = new ToggleClassDirective(element, renderer);
    expect(directive).toBeTruthy();
  }));
});
