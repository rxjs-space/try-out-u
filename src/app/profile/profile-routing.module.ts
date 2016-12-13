import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { AuthGuardsService } from '../shared/services/auth-guards.service';

export const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: ProfileComponent,
    children: [
      // { path: '', pathMatch: 'full', component: ProfileComponent },
      { path: '', pathMatch: 'full', /*canActivate: [ AuthGuardsService ], */component: ProfileDetailComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ AuthGuardsService ]
})

export class ProfileRoutingModule {
}
