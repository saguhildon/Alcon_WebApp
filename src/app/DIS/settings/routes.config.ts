import { Routes } from '@angular/router';
import { AppTemplateRoutes } from '@dis/settings/routes/routes.template.config';
import { RoleGuardService } from '@dis/services/auth/role-guard.service';
import { AuthGuardService } from '@dis/services/auth/auth-guard.service';
import { RoleTypes } from '@dis/services/auth/roles.enum';

// Import your app views below and add the array below
// For reference, see routes.template.config.js

export const AppRoutes: Routes = [
  // Define a default redirect
  { path: '', pathMatch: 'full', redirectTo: '/dashboard-analysis-kendo' },
  ...AppTemplateRoutes
];
