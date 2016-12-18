import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { AjaxService } from '../../shared/services/ajax.service';

import { Panel } from '../../tl-ui/tl-accordionr/tl-accordionr.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: 0
})
export class HomeComponent implements OnInit {
  // innerHHH = this.ajax.getArticleHtml();
  private panels: Panel[] = [
    {title: '<span>title0</span>', content: 'content0', expanded: true},
    {title: 'title1', content: 'content1'},
    {title: 'title2', content: 'content2', disabled: true},
  ]
  constructor(
    /*private ajax: AjaxService*/) { }

  ngOnInit() {
  }

}
