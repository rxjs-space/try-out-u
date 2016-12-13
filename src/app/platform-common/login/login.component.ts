import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
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
  @Output() logOut = new EventEmitter();
  @Output() logIn = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    @Inject('isBrowser') private isBrowser
  ) { }

  ngOnInit() {
  }

  onLogOutClick() {
    this.logOut.emit();
  }

  onLogInClick() {
    this.logIn.emit();
  }


}
