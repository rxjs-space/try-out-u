import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-platform-common',
  templateUrl: './platform-common.component.html',
  styleUrls: ['./platform-common.component.scss'],
  changeDetection: 0
})
export class PlatformCommonComponent implements OnInit {
  title: string = 'Welcome!';
  constructor() { }

  ngOnInit() {
  }

}
