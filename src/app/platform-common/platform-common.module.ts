import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppCommonRoutingModule } from './platform-common-routing.module';
import { PlatformCommonComponent } from './platform-common.component';
import { HomeComponent } from './home/home.component';
import { HeroAppModule } from '../hero-app/hero-app.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PlatformCommonComponent, HomeComponent],
  exports: [PlatformCommonComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppCommonRoutingModule,
    HeroAppModule,
    SharedModule.withProviders()
  ],
})
export class PlatformCommonModule { }
