import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

// import { SharedComponent } from './shared.component';
import { LogItPipe } from './pipes/log-it.pipe';
import { LogService } from './services/log.service';
import { ToggleClassDirective } from './directives/toggle-class.directive';
import { UserService } from './services/user.service';
import { HelpersService } from './services/helpers.service';
import { AjaxService } from './services/ajax.service';
import { TlLearnDirective } from './directives/tl-learn.directive';
import { TlLearnComponent } from './components/tl-learn/tl-learn.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    /*SharedComponent,*/
    LogItPipe,
    ToggleClassDirective,
    TlLearnDirective,
    TlLearnComponent
  ],
  exports: [
    LogItPipe,
    FormsModule,
    ToggleClassDirective,
    TlLearnDirective,
    TlLearnComponent
  ]
})
export class SharedModule {
  static withProviders() {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [
        LogService,
        UserService,
        { provide: 'isProd', useValue: environment.production },
        HelpersService,
        AjaxService
      ]
    };
  }
}
