import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { Search } from './components/search/search';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuardService } from './services/logged-in-guard.service';

export const routes: Routes = [
  // 1. Default redirect (Base URL goes to login)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // 2. Your specific routes
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomepageComponent,canActivate: [LoggedInGuardService] },
  { path: 'homepage', component: HomepageComponent,canActivate: [LoggedInGuardService] }, 
  { path: 'tasks', component: MyTasksComponent,canActivate: [LoggedInGuardService] },
  { path: 'search', component: Search,canActivate: [LoggedInGuardService] }, 

  { path: '**', redirectTo: '/homepage' }
];