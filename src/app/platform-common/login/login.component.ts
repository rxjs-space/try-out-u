import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() loginStatus: boolean;
  @Input() loginUrl: string;
  @Input() loggingIn: boolean;
  @Output() clickLogin = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }

  onClickLogin() {
    this.clickLogin.emit('logging in');
  }

}
