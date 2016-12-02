import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { SharedComponent } from './shared.component';
import { LogItPipe } from './pipes/log-it.pipe';
import { LogService } from './services/log.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [/*SharedComponent,*/ LogItPipe ],
  exports: [
    LogItPipe,
    FormsModule
  ]
})
export class SharedModule {
  static withProviders() {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [
        LogService
      ]
    };
  }
}
