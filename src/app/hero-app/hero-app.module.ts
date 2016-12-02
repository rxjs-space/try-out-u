import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { HeroAppComponent } from './hero-app.component';
import { HeroDataService } from './services/hero-data.service';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroLiComponent } from './hero-li/hero-li.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    HeroAppComponent,
    HeroListComponent,
    HeroLiComponent,
    HeroDetailComponent
  ],
  exports: [HeroAppComponent],
  providers: [
    HeroDataService
  ]
})
export class HeroAppModule { }
