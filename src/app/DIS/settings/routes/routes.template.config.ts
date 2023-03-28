import { Routes } from '@angular/router';
import { RoleGuardService } from '@dis/services/auth/role-guard.service';
import { AuthGuardService } from '@dis/services/auth/auth-guard.service';
import { RoleTypes } from '@dis/services/auth/roles.enum';

/**
 *  BELOW ARE ROUTES USED IN TEMPLATE
 *  DO NOT EDIT
 *
 *  Treat this as a sample when you link your pages in routes.config.ts
 */

// NOTE: Do not add views within /DIS folder (this folder will be updated and your project specific code shouldn't be here)
// The views below are within /DIS folder because we created them and are responsible for updating them
import { LoginComponent } from '@dis/views/login/login.component';
import { SamplePageComponent } from '@dis/views/sample-page/sample-page.component';
import { EditedPageComponent } from '@dis/views/edited-page/edited-page.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { DashboardAlconComponent } from 'src/app/dashboard-alcon/dashboard-alcon.component';
import { DashboardAnalysisComponent } from 'src/app/dashboard-analysis/dashboard-analysis.component';
import { HistoricalAnalysisComponent } from 'src/app/historical-analysis/historical-analysis.component';
import { DashboardAnalysisnewComponent } from 'src/app/dashboard-analysisnew/dashboard-analysisnew.component';
import { DashboardAnalysisKendoComponent } from 'src/app/dashboard-analysis-kendo/dashboard-analysis-kendo.component';
import { UploadComponent } from 'src/app/upload/upload.component';
import { ReportDowntimeComponent } from 'src/app/report-downtime//report-downtime.component';
import { FileUploaderComponent } from 'src/app/file-uploader/file-uploader.component';
import { FileListComponent } from 'src/app/file-list/file-list.component';
import { AnalysisNewComponent } from 'src/app/analysis-new/analysis-new.component';

export const AppTemplateRoutes: Routes = [
  // Below is how to include a page
  { path: 'login', component: LoginComponent },
  // Below is how to include a page that can be accessed after any user is logged in
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService], // To accept ALL access after login, use AuthGuardService
    data: {
      elevation: [] // Not required when using AuthGuardService
    }
  },
  {
    path: 'dashboard-sample-2',
    component: DashboardAlconComponent,
    canActivate: [AuthGuardService], // To accept ALL access after login, use AuthGuardService
    data: {
      elevation: [] // Not required when using AuthGuardService
    }
  },
  {
    path: 'sample',
    component: SamplePageComponent,
    canActivate: [AuthGuardService], // To accept ALL access after login, use AuthGuardService
    data: {
      elevation: [] // Not required when using AuthGuardService
    }
  },
  // Below is how to include a page that can be accessed after a user with SPECIFIED role is logged in
  {
    path: 'sample2',
    component: EditedPageComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-analysis',
    component: DashboardAnalysisComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-analysisnew',
    component: DashboardAnalysisnewComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'dashboard-analysis-kendo',
    component: DashboardAnalysisKendoComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    }
  },
  {
    path: 'historical-analysis',
    component: HistoricalAnalysisComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },
  {
    path: 'analysis-new',
    component: AnalysisNewComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },
  {
    path: 'report-downtime',
    component: ReportDowntimeComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },
  {
    path: 'fileupload',
    component: FileUploaderComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },
  {
    path: 'filelist',
    component: FileListComponent,
    canActivate: [RoleGuardService], // ONLY acceptable ELEVATION can access after login
    data: {
      elevation: [
        RoleTypes.ROLE_ADMIN,
        RoleTypes.ROLE_MANAGER,
        RoleTypes.ROLE_USER
      ] // List out all roles that are acceptable
    },
  },

  { path: '**', redirectTo: '' }
];
