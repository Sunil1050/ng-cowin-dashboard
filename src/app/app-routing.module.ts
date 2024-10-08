import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { StateDetailComponent } from './home/state-detail/state-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'state/:stateCode',
    component: StateDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
