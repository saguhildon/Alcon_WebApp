import { Component, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'app-dashboard-dialog-analysis',
  templateUrl: './dashboard-dialog-analysis.component.html',
  styleUrls: ['./dashboard-dialog-analysis.component.scss']
})
export class DashboardDialogAnalysisComponent implements OnInit {
  @Input() public substationname: string;

  constructor() { }
  public opened = true;

  ngOnInit(): void {
  }

  close() {
    console.log(`Dialog result: ${status}`);
    this.opened = false;
  }

}
