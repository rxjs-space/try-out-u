import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppCommonRoutingModule } from './platform-common-routing.module';
import { PlatformCommonComponent } from './platform-common.component';
import { HomeComponent } from './home/home.component';
import { HeroAppModule } from '../hero-app/hero-app.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [PlatformCommonComponent, HomeComponent, LoginComponent],
  exports: [PlatformCommonComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppCommonRoutingModule,
    HeroAppModule,
    SharedModule.withProviders(),
    NgbModule.forRoot()
  ],
})
export class PlatformCommonModule { }
