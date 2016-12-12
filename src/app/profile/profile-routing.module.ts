import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProfileComponent
    // children: [
    //   { path: '', pathMatch: 'full', component: HomeComponent },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ ]
})

export class ProfileRoutingModule {
}
