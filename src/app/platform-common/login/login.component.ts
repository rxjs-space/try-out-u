import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() loginStatus: boolean;
  @Input() loginUrl: string;
  loggingIn: boolean;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(queryParams => {
        if (queryParams['loggingIn'] || queryParams['code']) {
          this.loggingIn = true;
        } else {
          this.loggingIn = false;
        }
      })
  }


}
