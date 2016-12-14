import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { AjaxService } from '../../shared/services/ajax.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: 0
})
export class HomeComponent implements OnInit {
  // innerHHH = this.ajax.getArticleHtml();

  constructor(
    /*private ajax: AjaxService*/) { }

  ngOnInit() {
  }

}
