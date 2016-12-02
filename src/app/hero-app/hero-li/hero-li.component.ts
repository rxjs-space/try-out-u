import { Component, OnInit, Input } from '@angular/core';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-li',
  templateUrl: './hero-li.component.html',
  styleUrls: ['./hero-li.component.scss'],
  changeDetection: 0
})
export class HeroLiComponent implements OnInit {
  @Input() hero: Hero;
  @Input() actionRxx: any;

  constructor() { }

  ngOnInit() {
  }

  selectHero() {
    if ( !this.hero.selected ) {
      this.actionRxx.next({type: 'select', payload: {id: this.hero.id}});
    }
  }

  change(newName) {
    if (newName !== this.hero.name) {
      this.actionRxx.next({
        type: 'change',
        payload: {
          id: this.hero.id,
          newName
        }
      });
    }
  }

  delete() {
    this.actionRxx.next({
      type: 'delete',
      payload: {
        id: this.hero.id
      }
    });
  }
}
