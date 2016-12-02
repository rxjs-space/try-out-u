import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Hero } from './hero';
import { HeroDataService } from './services/hero-data.service';

@Component({
  selector: 'app-hero-app',
  templateUrl: './hero-app.component.html',
  styleUrls: ['./hero-app.component.scss'],
  changeDetection: 0
})
export class HeroAppComponent implements OnInit {
  private title: string;
  private myHero: Hero;

  private heroesRxx: BehaviorSubject<Hero[]>;
  private heroRxxMap: Map<any, BehaviorSubject<Hero>>;
  private actionRxx: any;
  private selectedHeroRxx: any;

  constructor( private heroService: HeroDataService ) {
      this.title = 'Tour of Heroes';
    }

  ngOnInit() {
    this.heroesRxx = this.heroService.HeroesRxx;
    this.heroRxxMap = this.heroService.HeroRxxMap;
    this.actionRxx = this.heroService.ActionRxx;
    this.selectedHeroRxx = this.heroService.selectedHeroRxx;
  }

  onClick(hero: Hero): void {
    this.myHero = hero;
  }

}
