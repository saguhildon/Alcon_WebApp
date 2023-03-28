import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { ThreeJSModel } from '../model';
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
import { DashboardDialogAnalysisComponent } from "../dashboard-dialog-analysis/dashboard-dialog-analysis.component";
import { environment_config } from '@dis/settings/environments/environment';
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
import { drawDOM } from '@progress/kendo-drawing';


@Component({
  selector: 'app-dashboard-analysis-kendo',
  templateUrl: './dashboard-analysis-kendo.component.html',
  styleUrls: ['./dashboard-analysis-kendo.component.scss']
})

export class DashboardAnalysisKendoComponent implements OnInit {
  public API_WEBSOCKET = environment_config.websocket;
  public URL = environment_config.apiUrl;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridView1: any[];
  public mySelection: string[] = [];

  public value: Date = new Date(2000, 2, 10);
  ctx: CanvasRenderingContext2D;
  canvasEl: any;
  current_datePipeString: any;
  current_timePipeString: any;
  future_datepipestring1: any;
  future_datepipestring2: any;
  subscription: Subscription;
  public selectedLT: any;
  public selectedLT_name: any = '';
  public selectedTimeStep = "1";
  //Gauge Chart
  public showLabels = false;
  public showTicks = true;
  public reverse = false;
  public ticksColor = '#fff';
  public fontstyle = '1px ';
  public labelsColor = '#fff';
  public station1: any[];
  public station2: any[];
  public predictedconditionlabel1: any;
  public predictedconditionlabel2: any;
  public json_machine_details_data: any =
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
        textureURL: "../../assets/img/Magazine.png"
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
        textureURL: "../../assets/img/Filming.png"
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
        textureURL: "../../assets/img/Dosing.png"
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
        textureURL: "../../assets/img/Forming.png"
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
        textureURL: "../../assets/img/Optic_Zone_Inspection.png"
      }
    ];

  public LT: any = [
    "PP01",
    "PP02",
    "PP03",
    "PP04",
    "PP05",
    "PP06",
    "PP07",
    "PP08",
    "PP09",
    "PP10",
    "PP11",
    "PP12",
    "PP13",
    "PP14",
    "PP15",
    "PP16",
  ];

  public TimeStep: Array<string> = [
    "1",
    "2",
    "3",
    "4",
    "5",
  ];
  public web_soc_array: any = [];
  constructor(private three: ThreeJSModel,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private popupService: PopupService,
    private windowService: WindowService,
    private dialogService: DialogService,
    private elem: ElementRef,
    public datePipe: DatePipe) { }

  // Call web API to get machine details
  initContent(analyse_data) {
    this.json_machine_details_data = [];
    combineLatest([
      this.httpClient.get(this.URL + 'api/Config/GetProductionLine'),
      this.httpClient.get(this.URL + 'api/Config/GetProductionLine'),
      this.httpClient.get(this.URL + 'api/Config/GetMachineDetails?productionlineName=' + this.selectedLT['productionlinename']).pipe(
        tap(result => {
          this.json_machine_details_data = result;
          this.json_machine_details_data.forEach(element => {
            analyse_data.forEach(element1 => {
              if (element.substationcode == element1.sub_station) {
                element.anomaly_results = element1.predicted_machine_condition == 'Normal' ? 0 : 1;
                console.log(element.anomaly_results)
              }
            })

          });

          this.three.initResolveURL("http://20.188.105.191/Alcon_PrototypeGUI");
          this.three.initWindowService(this.windowService, DashboardDialogAnalysisComponent);
          this.three.initRendererContainer(this.rendererContainer);
          this.three.load3DContent(this.json_machine_details_data);
        })
      )
    ]).subscribe(
      ([res_country, res_jobsite, res_machine_details]) => {
      }, (err) => {
        console.log(err);
      });
  }

  // Call web API to get production line details
  getproductionline() {
    this.httpClient.get<any>(this.URL + 'api/Config/GetProductionLine').subscribe(data => {
      this.LT = data;
      this.selectedLT = this.LT[0];
      this.selectedLT_name = this.LT[0]['productionlinename'];
      this.getGetMachineDetails();

    })
  }

  getGetMachineDetails() {
    this.httpClient.get<any>(this.URL + 'api/Config/GetMachineDetails?productionlineName=' + this.selectedLT['productionlinename']).subscribe(data => {
      this.json_machine_details_data = data;
      this.initWebSocket();
    })
  }
  // Call on page load
  ngOnInit(): void {
    this.getproductionline();
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.getcurrent_predictedtime());
  }

  PPvalueChange(value) {
    console.log(this.selectedLT);
    this.selectedLT_name = this.selectedLT['productionlinename'];
    this.populate_websocket_data(this.web_soc_array);
  }
  //Current Time Interval
  getcurrent_predictedtime() {
    this.current_datePipeString = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');    //console.log(this.current_datePipeString);
    this.current_timePipeString = this.datePipe.transform(Date.now(), 'hh:mm:ss');
  }

  ngOnDestroy() {
    if (this.subscription != undefined) {
      if (!this.subscription.closed) {
        this.subscription.unsubscribe();
      }
    }
    this.three.cleanUp();
  }

  ngAfterViewInit() {
    this.three.afterViewInit(this.rendererContainer);
  }
  // Method to populate webscoket inputs
  populate_websocket_data(json_in) {
    let msg = json_in
    let parsedjson = typeof msg != 'object' ? JSON.parse(JSON.stringify(msg)) : msg;
    let jsonarr = [];
    parsedjson.forEach(element => {
      if (this.selectedLT['id'] == element['PP']) {
        jsonarr.push(element);
      }
    });

    this.future_datepipestring1 = this.convertstringdatetimetodatetime(jsonarr[0]['predicted_start_time']);
    this.future_datepipestring2 = this.convertstringdatetimetodatetime(jsonarr[0]['predicted_end_time']);

    let finaljsonarr = [];
    for (const item of jsonarr) {
      finaljsonarr.push({
        // machine_condition: item.machine_condition,
        //current_time: item.current_time,
        predicted_start_time: item.predicted_start_time,
        predicted_end_time: item.predicted_end_time,
        predicted_machine_condition: item.predicted_machine_condition,
        //reasons: item.reasons,
        lt: item.PP,
        sub_station: item.sub_station,
        sub_station_name: (this.json_machine_details_data.filter(item1 => item.sub_station == (item1.substationcode)))[0]['substationname'],
        prediction_confidence: parseFloat(item.prediction_confidence) * 100,
        color: this.getcolor(parseFloat(item.prediction_confidence) * 100)
      })
    }

    this.gridView1 = finaljsonarr;

    let color1: any;
    let color2: any;
    for (const item of finaljsonarr) {
      if (item.sub_station == 'Magazine Station' && item.predicted_machine_condition == 'Fail') {
        this.predictedconditionlabel1 = 'F';
      }
      else {
        this.predictedconditionlabel1 = 'N';
      }
      if (item.sub_station == 'Film Station ( Feeding & Loader)' && item.predicted_machine_condition == 'Fail') {
        this.predictedconditionlabel2 = 'F';
      }
      else {
        this.predictedconditionlabel2 = 'N';
      }
      if (item.prediction_confidence <= 50) {
        color1 = 'green';
      }
      else if (item.prediction_confidence > 50 && item.prediction_confidence <= 75) {
        color1 = 'orange';
      }
      else {
        color1 = 'red';
      }

      if (item.prediction_confidence <= 50) {
        color2 = 'green';
      }
      else if (item.prediction_confidence > 50 && item.prediction_confidence <= 75) {
        color2 = 'orange';
      }
      else {
        color2 = 'red';
      }

    }
    let gauageval1 = [];

    gauageval1.push({
      value: finaljsonarr[0]['sub_station'] == 'MAG01' ? finaljsonarr[0]['prediction_confidence'] : 0,
      color: color1,
    })
    this.station1 = gauageval1;

    let gauageval2 = [];
    gauageval2.push({
      value: finaljsonarr[1]['sub_station'] === 'CTF01' ? finaljsonarr[1]['prediction_confidence'] : 0,
      color: color2,
    })
    this.station2 = gauageval2;
    this.initContent(jsonarr);
  }
  getcolor(prediction_confidence) {
    let color1: any;
    if (prediction_confidence <= 50) {
      color1 = 'red';
    }
    else if (prediction_confidence > 50 && prediction_confidence <= 75) {
      color1 = 'orange';
    }
    else {
      color1 = 'green';
    }
    return color1;
  }

  //Initialization of Web Socket
  initWebSocket() {

    this.web_soc_array = [];
    const subject = webSocket(this.API_WEBSOCKET);
    subject.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('message received: ' + JSON.stringify(msg));
        this.web_soc_array = msg;
        this.populate_websocket_data(msg);

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

  convertstringdatetimetodatetime(stringdatetime) {
    var result = stringdatetime.split(" ");
    var date = result[0].trim().split("-");
    var time = result[1].trim().split(":");

    var mydate = new Date(parseInt(date[2], 10),
      parseInt(date[1], 10) - 1,
      parseInt(date[0], 10),
      parseInt(time[0], 10),
      parseInt(time[1], 10)
    );

    return this.datePipe.transform((mydate), 'dd-MM-yyyy hh:mm')

  }

  //onchangeof Time step dropdown
  public onChange(value): void {
    //  alert(this.selectedLT);
    //  alert(this.selectedTimeStep);
  }

  //Disable the kendo drop down
  public itemDisabled(itemArgs: { dataItem: string, index: number }) {
    return itemArgs.index != 0; // disable the 3rd item
  }


  public show1 = false;
  public showconfidencelevel = false;
  public showreasons = false;
  public onToggle1(): void {
    this.show1 = !this.show1;

  }
  public onToggleconfidencelevel(): void {
    this.showconfidencelevel = !this.showconfidencelevel;

  }
  public onTogglereasons(): void {
    this.showreasons = !this.showreasons;

  }

  // Gauge pinter method
  gaugeponterarr(sub_station, predicted_machine_condition, prediction_confidence, dataItem) {
    let gauageval1 = [];
    var color1;
    if (prediction_confidence <= 50) {
      color1 = 'green';
    }
    else if (prediction_confidence > 50 && prediction_confidence <= 75) {
      color1 = 'orange';
    }
    else {
      color1 = 'red';
    }
    gauageval1.push({
      value: prediction_confidence,
      color: color1,
    })
    return gauageval1;
  }

}