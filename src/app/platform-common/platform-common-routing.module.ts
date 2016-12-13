import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileModule } from '../profile/profile.module';
import { HomeComponent } from './home/home.component';
import { HeroAppComponent } from '../hero-app/hero-app.component';
// import { AuthGuardsService } from '../shared/services/auth-guards.service';

// export function getProfileModule() {
//   return System.import('../profile/profile.module')
//     .then(mod => mod['ProfileModule']);
// }

export function getProfileModule() { // copied from universal starter
  if (!process.env.AOT) {
    return System.import('../profile/profile.module')
      .then(mod => mod['ProfileModule']);
  } /*else {
    return System.import('../profile/profile.module.ngfactory')
      .then(mod => mod['ProfileModuleNgFactory']);
  }*/
}

export const routes: Routes = [
  {
    path: '',
    // resolve: {
    //   urlBeforeLogin: 
    // },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'hero', component: HeroAppComponent },
      // { path: 'profile', loadChildren: '../profile/profile.module#ProfileModule' },
      // { path: 'profile', loadChildren: '../profile/profile.module#ProfileModule', syncChildren: () => ProfileModule },
      // { path: 'profile', loadChildren: () => ProfileModule },
      { path: 'profile', loadChildren: getProfileModule },
    ]
  },
];

      // { path: 'about', loadChildren: './about/about.module#AboutModule'},
      // {path: 'about', component: AboutDetailComponent},

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ /*AuthGuardsService*/ ]
})

export class AppCommonRoutingModule {
}
