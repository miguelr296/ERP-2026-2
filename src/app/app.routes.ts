import { Routes } from '@angular/router';
import { accessGuard, authGuard, guestGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './shared/layout/app-shell.component';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomersComponent } from './features/customers/customers.component';
import { OpportunitiesComponent } from './features/opportunities/opportunities.component';
import { AvailabilityComponent } from './features/availability/availability.component';
import { CostingComponent } from './features/costing/costing.component';
import { PlannedModuleComponent } from './features/planned/planned-module.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomersComponent, canActivate: [accessGuard], data: { subsystem: 'CRM', permission: 'R' } },
      { path: 'opportunities', component: OpportunitiesComponent, canActivate: [accessGuard], data: { subsystem: 'CRM', permission: 'R' } },
      { path: 'availability', component: AvailabilityComponent, canActivate: [accessGuard], data: { subsystem: 'CRM', permission: 'R' } },
      { path: 'costing', component: CostingComponent, canActivate: [accessGuard], data: { subsystem: 'CRM', permission: 'R' } },
      { path: 'engineering/costing', component: CostingComponent, canActivate: [accessGuard], data: { subsystem: 'ING', mode: 'engineering', permission: 'R' } },
      { path: 'planned/:system/:subsystem/:module/:option/:suboption', component: PlannedModuleComponent, canActivate: [accessGuard] }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
