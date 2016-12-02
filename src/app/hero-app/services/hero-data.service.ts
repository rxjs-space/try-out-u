import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';

import { Hero } from '../hero';

@Injectable()
export class HeroDataService {
  private heroes: Hero[];
  private _heroesRxx: BehaviorSubject<Hero[]>;
  private _heroRxxMap: Map<any, BehaviorSubject<Hero>>; // map from hero.id to BehaviorSubject<Hero>
  private _actionRxx: Subject<any> = new Subject();
  private _selectedHeroRxx: Subject<Hero> = new Subject();

  constructor() {
    this.heroes = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    this._heroesRxx = new BehaviorSubject([...this.heroes]);
    this._heroRxxMap = new Map();
    this.heroes.forEach(hero =>
      this._heroRxxMap.set(hero.id, new BehaviorSubject(Object.assign({}, hero)))
    );
    this._actionRxx.subscribe(this.actionHandlers);
  }

  private actionHandlers: any = (action: any) => {
    switch (action.type) {
      case 'select': return this.selectHero(action.payload);
      case 'delete': return this.deleteHero(action.payload);
      case 'change': return this.changeHero(action.payload);
      default: return;
    }
  }

  get HeroesRxx() {
    return this._heroesRxx;
  }

  get HeroRxxMap() {
    return this._heroRxxMap;
  }

  get ActionRxx() {
    return this._actionRxx;
  }

  get selectedHeroRxx() {
    return this._selectedHeroRxx;
  }

  private changeHero({id, newName}: {id: any, newName: string}) {
    // ajax.then
    this.heroes.filter(hero => hero.id === id)[0].name = newName;
    this._heroRxxMap.get(id).next({ id, name: newName });
  }

  private deleteHero({id}: {id: any}) {
    // ajax.then
    this.heroes = this.heroes.filter(hero => hero.id !== id);
    this._heroesRxx.next(this.heroes);
    console.log(id);
  }

  private selectHero({id}: {id: any}) {
    let prevSelectedHero = this.heroes.filter(hero => hero.selected === true)[0];
    if ( prevSelectedHero ) {
      prevSelectedHero.selected = false;
      this._heroRxxMap.get(prevSelectedHero.id).next(Object.assign({}, prevSelectedHero));
    }
    let currSelectedHero = this.heroes.filter(hero => hero.id === id)[0];
    currSelectedHero.selected = true;
    this._heroRxxMap.get(id).next(Object.assign({}, currSelectedHero));
    this._selectedHeroRxx.next(Object.assign({}, currSelectedHero));
  }
}
