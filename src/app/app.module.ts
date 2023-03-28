// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DialogModule, WindowModule, DialogService, WindowService } from "@progress/kendo-angular-dialog";
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader'
import { NgApexchartsModule } from 'ng-apexcharts';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import SpeechService from "./speech-service.service";
import { DatePipe } from '@angular/common';
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { ThreeJSModel } from './model';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatTableModule } from '@angular/material/table';


// Environment
import { environment } from 'src/environments/environment';

// Addon
import { ClickOutsideModule } from 'ng-click-outside';
import { JwtModule } from '@auth0/angular-jwt';
import 'hammerjs';

// Kendo
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { IconsModule } from '@progress/kendo-angular-icons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import {
  GridModule,
  PDFModule,
  ExcelModule
} from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { MenuModule } from '@progress/kendo-angular-menu';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';



// Components
import { NotificationsMenuComponent } from './DIS/components/notifications-menu/notifications-menu.component';
import { ProfileMenuComponent } from './DIS/components/profile-menu/profile-menu.component';
import { SidebarComponent } from './DIS/components/sidebar/sidebar.component';
import { LayoutComponent } from './DIS/components/layout/layout.component';

// App
import { AppRoutingModule } from './DIS/settings/routes/app-routing.module';
import { AppComponent } from './app.component';
import { ViewHeadingComponent } from './DIS/components/view-heading/view-heading.component';
import { ViewFilterComponent } from './DIS/components/view-filter/view-filter.component';
import { IndicatorCustomSampleComponent } from './DIS/components/indicator-custom-sample/indicator-custom-sample.component';

// Views
import { LoginComponent } from './DIS/views/login/login.component';
import { SamplePageComponent } from './DIS/views/sample-page/sample-page.component';
import { EditedPageComponent } from './DIS/views/edited-page/edited-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardDialogComponent } from './dashboard-dialog/dashboard-dialog.component';
import { DashboardAlconComponent } from './dashboard-alcon/dashboard-alcon.component';
import { DashboardDialogPopupComponent } from './dashboard-dialog-popup/dashboard-dialog-popup.component';
import { DashboardAnalysisComponent } from './dashboard-analysis/dashboard-analysis.component';
import { HistoricalAnalysisComponent } from './historical-analysis/historical-analysis.component';
import { DashboardAnalysisnewComponent } from './dashboard-analysisnew/dashboard-analysisnew.component';
import { DashboardDialogAnalysisComponent } from './dashboard-dialog-analysis/dashboard-dialog-analysis.component';
import { DashboardAnalysisKendoComponent } from './dashboard-analysis-kendo/dashboard-analysis-kendo.component';
import { UploadComponent } from './upload/upload.component';
import { ReportDowntimeComponent } from './report-downtime/report-downtime.component';

import {FileUploadModule} from 'ng2-file-upload';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileListComponent } from './file-list/file-list.component';

import { AnalysisNewComponent } from './analysis-new/analysis-new.component';

// Sort

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LayoutComponent,
    NotificationsMenuComponent,
    ProfileMenuComponent,
    LoginComponent,
    SamplePageComponent,
    ViewHeadingComponent,
    ViewFilterComponent,
    IndicatorCustomSampleComponent,
    EditedPageComponent,
    DashboardComponent,
    DashboardDialogComponent,
    DashboardAlconComponent,
    DashboardDialogPopupComponent,
    DashboardAnalysisComponent,
    HistoricalAnalysisComponent,
    DashboardAnalysisnewComponent,
    DashboardDialogAnalysisComponent,
    DashboardAnalysisKendoComponent,
    UploadComponent,
    ReportDowntimeComponent,
    FileUploaderComponent,
    FileListComponent,
    AnalysisNewComponent,
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: [environment.API_ROOT],
        disallowedRoutes: [environment.SSO_ENDPOINT]
      }
    }),
    AngularSvgIconModule.forRoot(),
    AngularSvgIconPreloaderModule.forRoot({
      configUrl: '../assets/icon/icon.json',
    }),
    AngularFileUploaderModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonsModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    NavigationModule,
    IconsModule,
    LayoutModule,
    DropDownsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    ChartsModule,
    MenuModule,
    IndicatorsModule,
    LabelModule,
    InputsModule,
    NgxSpinnerModule,
    MatDialogModule,
    NgbModule,
    PopupModule,
    DialogModule,
    WindowModule,
    NgApexchartsModule,
    IntlModule,
    DateInputsModule,
    FileUploadModule,
    ReactiveFormsModule,
    MatTableModule,
    GaugesModule
  ],
  providers: [
    WindowService,
    DialogService,
    SpeechService,
    DatePipe,
    ThreeJSModel
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
