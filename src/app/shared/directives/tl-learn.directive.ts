import { Directive, HostBinding, HostListener, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTlLearn]',
  // host: {'role': 'dird'}
})
export class TlLearnDirective {
  // @HostBinding('attr.role') role = 'dir';
  constructor(private tr: TemplateRef<any>, private vcr: ViewContainerRef) { }
  ngOnInit() {
    this.vcr.createEmbeddedView(this.tr);
    // console.log(this.vcr);
  }
  // @HostListener('click', ['$event']) onHostClick(e) {
  //   console.log(e);
  // }

}
