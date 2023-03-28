import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { ThreeJSModel } from './model';
import TextSprite from '@seregpie/three.text-sprite';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { mergeMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { webSocket } from "rxjs/webSocket";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DashboardDialogComponent } from "../dashboard-dialog/dashboard-dialog.component";
import { DashboardDialogPopupComponent } from "../dashboard-dialog-popup/dashboard-dialog-popup.component";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { currentstatus } from '../jsonmockupdatafile';
import Speech from 'speak-tts';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ValueAxisLabels } from "@progress/kendo-angular-charts";
import {
  WindowService,
  WindowRef,
  WindowCloseResult,
} from "@progress/kendo-angular-dialog";
import {
  DialogService,
  DialogRef,
  DialogCloseResult,
} from "@progress/kendo-angular-dialog";


@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './dashboard-analysis.component.html',
  styleUrls: ['./dashboard-analysis.component.scss']
})
export class DashboardAnalysisComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridView1: any[];
  public mySelection: string[] = [];

  public value: Date = new Date(2000, 2, 10);
  ctx: CanvasRenderingContext2D;
  canvasEl: any;
  current_datePipeString : any;
  current_timePipeString:any;
  future_datepipestring1: any;
  future_datepipestring2: any;
  subscription: Subscription;
  public selectedLT = "LT01";
  public selectedTimeStep = "1";
  //Gauge Chart
  public showLabels = true;
    public showTicks = true;
    public reverse = false;
    public ticksColor = '#fff';
    public fontstyle = '3px';
    public labelsColor = '#fff';
    public station1: any[] ;
    public station2:any[];
    public predictedconditionlabel1:any;
    public predictedconditionlabel2:any;
  public json_machine_details_data:any =
[
{
substationcode: "PIM01",
substationstatuscode: "OPN",
substationname: "Magazine Station",
anomaly_results: 1,
positionx: 0,
positiony: 0,
positionz: 0,
rotationx: 0,
rotationy: 0,
rotationz: 0,
geometrydepth: 48,
geometryheight: 24,
geometrywidth: 64,
textureURL:"../../assets/img/Magazine.png"
},
{
substationcode: "PIM02",
substationstatuscode: "OPN",
substationname: "Fliming Station",
anomaly_results: 0,
positionx: 94,
positiony: 0,
positionz: 0,
rotationx: 0,
rotationy: 0,
rotationz: 0,
geometrydepth: 48,
geometryheight: 24,
geometrywidth: 64,
textureURL:"../../assets/img/Filming.png"
},
{
substationcode: "PIM03",
substationstatuscode: "NIU",
substationname: "Dosing Station",
anomaly_results: 0,
positionx: 0,
positiony: 0,
positionz: 94,
rotationx: 0,
rotationy: 0,
rotationz: 0,
geometrydepth: 48,
geometryheight: 24,
geometrywidth: 64,
textureURL:"../../assets/img/Dosing.png"
},
{
substationcode: "PIM04",
substationstatuscode: "NIU",
substationname: "Forming Station",
anomaly_results: 0,
positionx: 0,
positiony: 0,
positionz: 188,
rotationx: 0,
rotationy: 0,
rotationz: 0,
geometrydepth: 48,
geometryheight: 24,
geometrywidth: 64,
textureURL:"../../assets/img/Forming.png"
},
{
substationcode: "PIM05",
substationstatuscode: "NIU",
substationname: "Optic Zone Inspec.",
anomaly_results: 0,
positionx: 94,
positiony: 0,
positionz: 94,
rotationx: 0,
rotationy: 0,
rotationz: 0,
geometrydepth: 48,
geometryheight: 24,
geometrywidth: 64,
textureURL:"../../assets/img/Optic_Zone_Inspection.png"
}
];

public LT: Array<string> = [
  "LT01",
  "LT02",
  "LT03",
  "LT04",
  "LT05",
  "LT06",
  "LT07",
  "LT08",
  "LT09",
  "LT10",
  "LT11",
  "LT12",
  "LT13",
  "LT14",
  "LT15",
  "LT16",
];

public TimeStep: Array<string> = [
  "1",
  "2",
  "3",
  "4",
  "5",    
];
public charttitle2 = "Monthly Mean Breakdown \n Time for LT 01 (minutes)";
  public charttitle3 = "Monthly Mean Breakdown \n Time for LT 01 (minutes)";
  constructor(private three: ThreeJSModel,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private popupService: PopupService,
    private windowService: WindowService,
    private dialogService: DialogService,
    private elem: ElementRef,
    public datePipe: DatePipe) {  
      this.charttitle2 = this.charttitle3.replace(/(.{30})/g,"\n");
    this.charttitle3 = this.charttitle3.replace(/(.{30})/g,"\n");
  }

  initContent() {
    combineLatest([
    this.httpClient.get('https://localhost:44384/api/Config/GetCountry'),
    this.httpClient.get('https://localhost:44384/api/Config/GetJobSite'),
    this.httpClient.get('http://20.188.105.191/Alcon_Config/api/Config/GetMachineDetails').pipe(
    //this.httpClient.get('https://localhost:44384/api/Config/GetMachineDetails').pipe(
    tap(result => {
    console.log(result);
    this.json_machine_details_data = result;
    this.json_machine_details_data.forEach(element => {
    if(element.substationcode =="MAG01")
    element.anomaly_results = 1;
    else
    element.anomaly_results = 0;
    });
    this.three.initRendererContainer(this.rendererContainer);
    this.three.load3DContent(this.json_machine_details_data);
    this.three.afterViewInit(this.rendererContainer);
    })
    )
    ]).subscribe(
    ([res_country, res_jobsite, res_machine_details]) => {
    //console.log(res_country);
    //console.log(res_jobsite);
    console.log(res_machine_details);
    },(err) => {
    console.log(err);
    });
    }

  ngOnInit(): void {
    this.initContent();
    this.initWebSocket();
    const source = interval(1000);    
    this.subscription = source.subscribe(val => this.getcurrent_predictedtime());  
  }
  getcurrent_predictedtime(){    
    this.current_datePipeString = this.datePipe.transform(Date.now(),'dd-MM-yyyy');    //console.log(this.current_datePipeString);
    this.current_timePipeString = this.datePipe.transform(Date.now(),'hh:mm:ss');
  }
  ngOnDestroy(){
    if(this.subscription !=undefined){
      if(!this.subscription.closed){
        this.subscription.unsubscribe();
      }
    }
  }
  initWebSocket() {
    const subject = webSocket('ws://localhost:5678');

    subject.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('message received: ' + JSON.stringify(msg));
        let parsedjson = JSON.parse(JSON.stringify(msg));
        let jsonarr =[];
        parsedjson.forEach(element => {          
          jsonarr.push(JSON.parse(element));
        });  
        
  //  this.current_datePipeString = this.convertstringdatetimetodatetim(jsonarr[0]['current_time']);
    this.future_datepipestring1 = this.convertstringdatetimetodatetime(jsonarr[0]['predicted_start_time']);
    this.future_datepipestring2 = this.convertstringdatetimetodatetime(jsonarr[0]['predicted_end_time']);  

        let finaljsonarr = [];
        for(const item of jsonarr){
         // console.log(item.predicted_machine_condition);
          finaljsonarr.push({
            machine_condition: item.machine_condition,
            current_time :item.current_time,
            predicted_start_time:item.predicted_start_time,
            predicted_end_time:item.predicted_end_time,
            predicted_machine_condition:item.predicted_machine_condition,
            reasons:item.reasons,
            lt:item.lt,
            sub_station:item.sub_station,
            prediction_confidence: parseFloat(item.prediction_confidence)*100
          })
        }
        this.gridView1 = finaljsonarr;
        let color1:any;
        let color2:any;
        for(const item of finaljsonarr){
          if(item.sub_station =='Magazine Station' && item.predicted_machine_condition == 'Fail'){
            this.predictedconditionlabel1 = 'F';
          }
          else{
            this.predictedconditionlabel1 = 'N';
          }
          if(item.sub_station == 'Film Station ( Feeding & Loader)' && item.predicted_machine_condition == 'Fail'){
            this.predictedconditionlabel2 = 'F';
          }
          else{
            this.predictedconditionlabel2 = 'N';
          }

          if(item.sub_station =='Magazine Station' && item.prediction_confidence <=50){
            color1 = 'green';
          }
          else if(item.sub_station =='Magazine Station' && item.prediction_confidence >50 && item.prediction_confidence <=75){
            color1 = 'orange';
          }
          else{
            color1 = 'red';
          }

          if(item.sub_station =='Film Station ( Feeding & Loader)' && item.prediction_confidence <=50){
            color2 = 'green';
          }
          else if(item.sub_station =='Film Station ( Feeding & Loader)' && item.prediction_confidence >50 && item.prediction_confidence <=75){
            color2 = 'orange';
          }
          else{
            color2 = 'red';
          }
        }
        let gauageval1 =[];
        gauageval1.push({
          value: finaljsonarr[0]['sub_station'] =='Magazine Station' ? finaljsonarr[0]['prediction_confidence']:0,
          color: color1,
        })
        this.station1 = gauageval1;

        let gauageval2 =[];
        gauageval2.push({
          value: finaljsonarr[1]['sub_station'] ==='Film Station ( Feeding & Loader)' ? finaljsonarr[1]['prediction_confidence']:0,
          color: color2,
        })
        this.station2 = gauageval2;
      },
      err => {
        // Called if at any point WebSocket API signals some kind of error.
        console.log(err)
      },
      () => {
        // Called when connection is closed (for whatever reason).
        console.log('complete')
      }
    );
  }

  convertstringdatetimetodatetime(stringdatetime){
    var result = stringdatetime.split(" ");
    var date=result[0].trim().split("-");
    var time=result[1].trim().split(":");
    
    var mydate = new Date(parseInt(date [2], 10),
                      parseInt(date [1], 10) - 1,
                      parseInt(date [0], 10),
                      parseInt(time [0], 10),
                      parseInt(time [1], 10)                      
                      );
                      // var mydate = new Date(parseInt(date [2], 10),
                      // parseInt(date [1], 10) - 1,
                      // parseInt(date [0], 10),
                      // parseInt(time [0], 10),
                      // parseInt(time [1], 10),
                      // parseInt(time [2], 10)
                      // );
                     
    return this.datePipe.transform((mydate),'dd-MM-yyyy hh:mm')
    
  }
  ngAfterViewInit() {
    this.three.initRendererContainer(this.rendererContainer);
    this.three.load3DContent(this.json_machine_details_data);
    this.three.afterViewInit(this.rendererContainer);
    }

    public toggleText = "Hide";
  public show1 = false;
  public show2 = false;
  public show3 = false;
  public onToggle1(): void {
    //alert(this.show);
    this.show1 = !this.show1;
    //alert(this.show);
    this.toggleText = this.show1 ? "Hidе" : "Show";
  }
  public onToggle2(): void {
    //alert(this.show);
    this.show2 = !this.show2;
    //alert(this.show);
    this.toggleText = this.show2 ? "Hidе" : "Show";
  }
  public onToggle3(): void {   
    this.show3 = !this.show3;   
    this.toggleText = this.show3 ? "Hidе" : "Show";
  }

  public onChange(value): void {
  //  alert(this.selectedLT);
  //  alert(this.selectedTimeStep);
   }

   public valueAxisLabels: ValueAxisLabels = {
    // font: "bold 16px Arial, sans-serif",
    color:"white"
  };
  // public valueAxisLabels1: ValueAxisLabels = {
  //    font: "bold 16px Arial, sans-serif",
  //   color:"white"
  // };

  

    public itemDisabled(itemArgs: { dataItem: string, index: number }) {
      return itemArgs.index != 0; // disable the 3rd item
  }

}
