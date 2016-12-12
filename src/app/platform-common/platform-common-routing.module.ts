import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { ProfileModule } from '../profile/profile.module';
import { HomeComponent } from './home/home.component';
import { HeroAppComponent } from '../hero-app/hero-app.component';


export const routes: Routes = [
  {
    path: '',
    // resolve: {
    //   urlBeforeLogin: 
    // },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'hero', component: HeroAppComponent },
      { path: 'profile', loadChildren: '../profile/profile.module#ProfileModule' },
    ]
  },
];

      // { path: 'about', loadChildren: './about/about.module#AboutModule'},
      // {path: 'about', component: AboutDetailComponent},

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ ]
})

export class AppCommonRoutingModule {
}
