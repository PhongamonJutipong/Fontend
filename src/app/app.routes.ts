import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.routes').then(m => m.LOGIN_ROUTES) },
  { path: 'dashboard',   loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
  { path: 'add-expense', loadChildren: () => import('./add-expense/add-expense.routes').then(m => m.ADD_EXPENSE_ROUTES) },
  { path: 'categories',  loadChildren: () => import('./categories/categories.routes').then(m => m.CATEGORIES_ROUTES) },
  { path: 'report-component',      loadChildren: () => import('./report-component/report.routes').then(m => m.REPORT_ROUTES) },
  { path: 'register',      loadChildren: () => import('./register/register.routes').then(m => m.REGISTER_ROUTES) },
  { path: '**', redirectTo: '' }
];
