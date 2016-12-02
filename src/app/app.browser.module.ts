import { NgModule } from '@angular/core';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser/browser';

import { AppComponent } from './index';
import { PlatformCommonModule } from './platform-common/platform-common.module';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    /**
     * NOTE: Needs to be your first import (!)
     * BrowserModule, HttpModule, and JsonpModule are included
     */
    UniversalModule,
    PlatformCommonModule
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },
  ]
})
export class AppModule {

}
