import { Directive, ElementRef, Renderer, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appToggleClass]'
})
export class ToggleClassDirective {
  togglableClasses: string[];
  private togglableState: boolean = false;
  constructor(private element: ElementRef, private renderer: Renderer) { }
  @Input() set appToggleClass(data: string | string[]) {
    if (Array.isArray(data)) {
      this.togglableClasses = <any>data;
    } else {
      this.togglableClasses = data.split(' ');
    }
  }

  @HostListener('click') onHostClick() {
      this.togglableState = !this.togglableState;
      this.toggleClass(this.togglableState);
  }
  toggleClass(isAdd: boolean) {
    this.togglableClasses.forEach(c => 
      this.renderer.setElementClass(this.element.nativeElement, c, isAdd)
    );
  }
}
