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
  @Input() loggingIn: boolean;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }


}
