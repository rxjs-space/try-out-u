import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AboutComponent } from './about/about.component';
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
