import { Component, OnInit, Input,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-li',
  templateUrl: './hero-li.component.html',
  styleUrls: ['./hero-li.component.scss'],
  changeDetection: 0,
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', [style({color: 'black'}), animate('100ms ease-in')]),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
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
