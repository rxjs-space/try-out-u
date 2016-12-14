import { Component, OnInit, /*ChangeDetectorRef*/ } from '@angular/core';
import { UserService } from '../shared/services/user.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-platform-common',
  templateUrl: './platform-common.component.html',
  styleUrls: ['./platform-common.component.scss'],
  changeDetection: 0
})
export class PlatformCommonComponent implements OnInit {
  title: string = 'Welcome!';

  // loginUrl: string;
  constructor(
    private userService: UserService) { }

  ngOnInit() {
    // this.ajax.getArticleHtml().subscribe(h => this.innerHHH = 'go');
    // console.log(Reflect.getMetadata('annotations', this.constructor));
    // this.userService.loginUrlRxx.subscribe(url => {
    //   // console.log(url);
    //   this.loginUrl = url;
    // });
    // this.route.data.subscribe(data=> console.log(`reading data at platformcommon: ${JSON.stringify(data)}`));
  }

}
