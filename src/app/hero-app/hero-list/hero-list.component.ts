import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  changeDetection: 0

})
export class HeroListComponent implements OnInit {
  @Input() heroes: any;
  @Input() heroRxxMap: any;
  @Input() actionRxx: any;
  toggleCollapseSiblingState = false;
  constructor() {
  }

  ngOnInit() {
    // debugger;
  }

  toggleCollapseSibling() {
    this.toggleCollapseSiblingState = !this.toggleCollapseSiblingState;
  }


}
