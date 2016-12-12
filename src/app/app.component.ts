import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<app-platform-common></app-platform-common>`,
  styleUrls: [],
  changeDetection: 0
})
export class AppComponent {
  constructor(private router: Router) {
  } // For viewing the routes in Augury, inject Router here with the name router
}
