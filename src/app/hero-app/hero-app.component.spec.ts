/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HeroAppComponent } from './hero-app.component';
import { HeroDataService } from './services/hero-data.service';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroLiComponent } from './hero-li/hero-li.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';


export const heroModuleConfig = {
  imports: [
    FormsModule,
    SharedModule.withProviders()
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
}
describe('HeroAppComponent', () => {
  let component: HeroAppComponent;
  let fixture: ComponentFixture<HeroAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(heroModuleConfig)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
