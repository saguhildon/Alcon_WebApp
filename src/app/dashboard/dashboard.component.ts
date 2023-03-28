import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  //@ViewChild('canvas') myCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  public gridData1: any[] = currentstatus;
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
  public selectedTimeStep = "1"

  public json_machine_status_color = 
    {
      machine_color:
      {
        normal_color: 0xECF0F1,
        abnormal_color: 0xF7DC6F,
        not_in_use_color:0xD0D3D4
      },
      machine_outline_color:
      {
        normal_color: 0x3498DB,
        abnormal_color: 0xF39C12,
        not_in_use_color: 0x626567
      }
    };

    public json_canvas_machine_status_color = 
    {
      machine_color:
      {
        normal_color: "#ECF0F1",
        abnormal_color: "#F7DC6F",
        not_in_use_color: "#D0D3D4"
      },
      machine_outline_color:
      {
        normal_color: "#3498DB",
        abnormal_color: "#F39C12",
        not_in_use_color: "#626567"
      }
    };

    public json_machine_details_data:any = null;
    // public json_machine_details_data:any = 
    // [
    //   {
    //     machinecode: "PIM01",
    //     anomaly_results: 1,
    //     positionx: 0,
    //     positiony: 0,
    //     positionz: 0,
    //     rotationx: 0,
    //     rotationy: 0,
    //     rotationz: 0,
    //     geometrydepth: 24,
    //     geometryheight: 24,
    //     geometrywidth: 64
    //   },
    //   {
    //     machinecode: "PIM02",
    //     anomaly_results: 0,
    //     positionx: 54,
    //     positiony: 0,
    //     positionz: 0,
    //     rotationx: 0,
    //     rotationy: 0,
    //     rotationz: 0,
    //     geometrydepth: 24,
    //     geometryheight: 24,
    //     geometrywidth: 64
    //   },
    //   {
    //     machinecode: "PIM03",
    //     anomaly_results: 0,
    //     positionx: 0,
    //     positiony: 0,
    //     positionz: 94,
    //     rotationx: 0,
    //     rotationy: 0,
    //     rotationz: 0,
    //     geometrydepth: 24,
    //     geometryheight: 24,
    //     geometrywidth: 64
    //   }
    // ];

  public VIEW_ANGLE = 45;
  public ASPECT = window.innerWidth / window.innerHeight;
  public NEAR = 0.1;
  public FAR = 1000;

  public renderer = new THREE.WebGLRenderer({antialias:true});
  public labelRenderer = new CSS2DRenderer();
  public scene = new THREE.Scene();
  public camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
  //public projector = new THREE.Projector();
  public controls = new OrbitControls(this.camera, this.renderer.domElement );
  public mesh = null;

  public raycaster = new THREE.Raycaster();
  public mouse = new THREE.Vector3();
  public scope = this;
  public meshMouseOver = null;
  public loader = new THREE.FontLoader();
  public font = undefined;
  public loadManager = null;


  public popupRef: PopupRef;
  public opened = true;

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

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private popupService: PopupService,
    private windowService: WindowService,
    private dialogService: DialogService,
    private elem: ElementRef,
    public datePipe: DatePipe) { 

    //this.init3DScene();
    //this.loadFont();

    /*
    const speech = new Speech();
    speech.setLanguage('zh-CN');
    speech.speak({
        //text: 'Hello! I am lisa, your friendly personal assistance. Please talk to me!',
        text: '您好！我是丽萨，您的友善私人助理。请和我说话！',
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    });
    */
    this.charttitle2 = this.charttitle3.replace(/(.{30})/g,"\n");
    this.charttitle3 = this.charttitle3.replace(/(.{30})/g,"\n");
  }

  initContent() {
    combineLatest([
      this.httpClient.get('https://localhost:44384/api/Config/GetCountry'),
      this.httpClient.get('https://localhost:44384/api/Config/GetJobSite'),
      this.httpClient.get('http://20.188.105.191/Alcon_Config/api/Config/GetMachineDetails').pipe(
        tap(result => {
          this.json_machine_details_data = result;
        })
      )
    ]).subscribe(
    ([res_country, res_jobsite, res_machine_details]) => {
      //console.log(res_country);
      //console.log(res_jobsite);
      console.log(res_machine_details);

      this.init3DScene();
    },(err) => {
      console.log(err);
      this.init3DScene();
    });
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

  ngOnInit(): void {
    //this.init3DScene();
    this.initWebSocket();
    this.initContent();
//    this.gridView1 = this.gridData1;
    const source = interval(1000);    
    this.subscription = source.subscribe(val => this.getcurrent_predictedtime());  
    // var today = new Date();
    // today.setHours(today.getHours() + 1); 
    // this.future_datepipestring1 = this.datePipe.transform(today,'dd-MM-yyyy hh:mm:ss');
    // this.future_datepipestring2 = this.datePipe.transform(today.setHours(today.getHours() + 1),'dd-MM-yyyy hh:mm:ss');   
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

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();

    var ctx: CanvasRenderingContext2D
    var canvas = <HTMLCanvasElement>this.rendererContainer.nativeElement.querySelectorAll("canvas")[0];
    console.log(canvas);

    ctx = canvas.getContext("2d");
    console.log(ctx);

  }


  animate() {
    //this.labelRenderer.render( this.scene, this.camera );

    //this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
    //this.labelRenderer.domElement.style.position = 'absolute';
    //this.labelRenderer.domElement.style.top = '0px';
    //this.labelRenderer.domElement.style.zIndex  = '0';
    //document.body.appendChild( this.labelRenderer.domElement );

    this.renderer.render(this.scene, this.camera);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.margin = '0 0 0 -190px';
    
    //this.renderer.domElement.style.opacity = '0.5' 
    //this.labelRenderer.domElement.style.zIndex  = '1';
    //this.renderer.domElement.style.top = '0px';
    this.renderer.setSize( window.innerWidth* 0.7, window.innerHeight * 0.7 );

    window.requestAnimationFrame(() => this.animate());
  }

  init3DScene() {
    console.log("inside init3DScene");
    this.rerender3DScene();
    this.load3DItems();

    this.loadManager = new THREE.LoadingManager();
    this.loadManager.onLoad = function() { // when all resources are loaded
      console.log("Load Completed !!!")
    }

    //this.loadFont();
  }

  

  loadFont() {
    this.loader = new THREE.FontLoader();
    this.loader.load( '../../assets/threejs/fonts/helvetiker_regular.typeface.json', function ( response ) {
      console.log(response);
      var fontParams = {
        font: response,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      };
    });
  }

  rerender3DScene() {
    // scene and camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);

    //this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    //this.camera.position.set( 150, 300, 500 );
    //this.camera.lookAt(new THREE.Vector3(100,-350,-800));

    this.camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.set( 1000 * 0.6, 800, 1000 * 0.9 );
    this.camera.lookAt( 350 * 0.8, 50 * 2.0, 150 * 1.5 );

    //this.camera.position.set(150, 150, 500);
    //this.camera.rotation.z = Math.PI
    //this.camera.rotation.y = Math.PI
    //this.camera.lookAt(0, 0, 0);

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement );
    //this.camera.position.set( 1000, 800, 1000 );
    //this.camera.lookAt( 350, 50, 150 );
    //this.controls.update();

    //pointermove
    this.renderer.domElement.addEventListener('click', this.onDocumentMouseClick.bind(this), false);
    //this.renderer.domElement.addEventListener('pointerdown', this.onDocumentMouseClick.bind(this), false);
    this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
  }

  onDocumentMouseMove(event) {
    //console.log("Inside Mouse Move");
    var rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left)/this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top)/this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects( this.scene.children, true );
    if ( intersects.length > 0 ) {

      for ( let i = 0; i < intersects.length; i ++ ) {
        /*
        if(this.meshMouseOver != null || this.meshMouseOver.object.uuid != intersects[i].object.uuid) {
          this.meshMouseOver.object.material.color.set( this.meshMouseOver.object.userData.currentColor );
          this.meshMouseOver = intersects[ i ];
        } else {
          this.meshMouseOver = intersects[ i ];
        }
        
        intersects[ i ].object.material.color.set( 0xff0000 );

        console.log("machineID: " + intersects[i].object.userData.machineID);
        console.log("uuid: " + intersects[i].object.uuid);
        console.log("mouseover uuid: " + this.meshMouseOver.object.uuid);
        */
      }
    }
  }

  onDocumentMouseClick(event) {
    //console.log("Mouse Clicking");
    var rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left)/this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top)/this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects( this.scene.children, true );
    for ( let i = 0; i < intersects.length; i ++ ) {
      console.log("substationcode: " + intersects[i].object.userData.substationcode);
      console.log("substationname: " + intersects[i].object.userData.substationname);
      this.openWindow(event.clientY, event.clientX,intersects[i].object.userData.substationname);
    }
  }

  public openWindow(top_pos, left_pos,substationname) {
    //console.log("top_pos: " + top_pos);
    //console.log("left_pos: " + left_pos);
    //Historical Predicted Results (<Machine Name>)
    const window: WindowRef = this.windowService.open({
      title: `Historical Predicted Results (${substationname})`,
      //title: machinename,
      content: DashboardDialogPopupComponent,
      width: 600,
      height: 680,
      top: top_pos - 180
    });
    const dashbordinfo = window.content.instance;
    dashbordinfo.substationname = substationname;
    
    window.result.subscribe((result) => {
      if (result instanceof WindowCloseResult) {
        console.log("Window was closed!");
      }
    });
  }

  load3DItems() {

    this.json_machine_details_data.forEach(element => {

      var mesh_color = null;
      if (element.substationstatuscode == 'false')
        mesh_color = this.json_machine_status_color.machine_color.not_in_use_color;
      else if (element.anomaly_results == 0)
        mesh_color = this.json_machine_status_color.machine_color.normal_color;
      else 
        mesh_color = this.json_machine_status_color.machine_color.abnormal_color;

      var mesh_outline_color = null;
      if (element.substationstatuscode == 'false')
        mesh_outline_color = this.json_machine_status_color.machine_color.not_in_use_color;
      else if (element.anomaly_results == 0)
        mesh_outline_color = this.json_machine_status_color.machine_color.normal_color;
      else 
        mesh_outline_color = this.json_machine_status_color.machine_color.abnormal_color;

      var mesh_canvas_color = null;
      if (element.substationstatuscode == 'false')
        mesh_canvas_color = this.json_canvas_machine_status_color.machine_color.not_in_use_color;
      else if (element.anomaly_results == 0)
        mesh_canvas_color = this.json_canvas_machine_status_color.machine_color.normal_color;
      else 
        mesh_canvas_color = this.json_canvas_machine_status_color.machine_color.abnormal_color;
      

      var geometry = new THREE.BoxGeometry( 
        element.geometrywidth, 
        element.geometryheight, 
        element.geometrydepth );

      var material = new THREE.MeshBasicMaterial
      ( 
        { 
          color: mesh_color,
          transparent:true, 
          opacity: 0.6
        } 
      );

      var materialMesh = 
        new THREE.MeshBasicMaterial({ 
          map: THREE.ImageUtils.loadTexture( 
              this.textMaterials(
                element.substationname, 
                mesh_canvas_color,
                element.geometrywidth,
                element.geometrydepth
                ) 
            ) 
        });

      var materials = [
        new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
        materialMesh,
        new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { color: mesh_color, transparent:true, opacity: 0.6 } )
      ];

      var mesh = new THREE.Mesh( geometry, material );
      //mesh.position.x = element.positionx;
      //mesh.position.y = element.positiony;
      //mesh.position.z = element.positionz;
      mesh.position.x = (element.geometrywidth / 2) + parseInt(element.positionz);
      mesh.position.y = (element.geometryheight / 2) + 0.1;
      mesh.position.z = (element.geometrydepth / 2) + parseInt(element.positionx) ;

      //mesh.rotation.y = Math.PI/2;
      mesh.rotation.x = element.rotationx;
      mesh.rotation.y = element.rotationy;
      mesh.rotation.z = element.rotationz;
      
      var json_data = {};
      json_data["substationcode"] = element.substationcode;
      json_data["substationname"] = element.substationname;
      json_data["intersected"] = false;
      json_data["currentColor"] = mesh_color;
      mesh.userData = json_data;
      
      const moonDiv = document.createElement( 'div' );
      moonDiv.className = 'label';
      moonDiv.textContent = element.substationname;
      moonDiv.style.marginTop = '-1em';
      const moonLabel = new CSS2DObject( moonDiv );
      var rect = this.renderer.domElement.getBoundingClientRect();
      moonLabel.position.set( 180, -20, -40 );
      //this.mouse.x = ((event.clientX - rect.left)/this.renderer.domElement.clientWidth) * 2 - 1;
      //this.mouse.y = -((event.clientY - rect.top)/this.renderer.domElement.clientHeight) * 2 + 1;
      mesh.add( moonLabel );
      
      this.scene.add(mesh);

      var edges = new THREE.EdgesGeometry( mesh.geometry );
      var line = new THREE.LineBasicMaterial
      ( 
        { 
          color: mesh_outline_color,
          linewidth: 10
        } 
      );

      var wireframe = new THREE.LineSegments( edges, line );
      mesh.add(wireframe);
      this.scene.add(mesh);
      
      
      /*
      if((element.anomaly_results == 1))
      {
        //geometry = new THREE.CircleGeometry( 10, 64 );
        //geometry = new THREE.CylinderGeometry( 10, 10, 2, 64 );
        geometry = new THREE.ConeGeometry( 5, 20, 32 );
        material = new THREE.MeshBasicMaterial
        ( 
          { 
            color: 0xFEF9E7,
            side: THREE.DoubleSide,
            transparent:false
            //opacity: 0.6
          } 
        );
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = element.positionx;
        mesh.position.y = element.positiony;
        mesh.position.z = element.positionz;

        mesh.rotation.x = Math.PI;
        this.scene.add(mesh);

        edges = new THREE.EdgesGeometry( mesh.geometry );
        line = new THREE.LineBasicMaterial
        ( 
          { 
            color: this.json_machine_status_color.machine_outline_color.abnormal_color,
            linewidth: 10
          } 
        );
        
        wireframe = new THREE.LineSegments( edges, line );
        mesh.add(wireframe);
      }
      */

    });
  }

  textMaterials(text, bgcolor, width, height) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.save();

    var x = width / 2;
    var y = height / 2;

    context.font = "30pt Calibri";
    context.textBaseline = 'top';
    context.fillStyle = bgcolor;

    /// get width of text
    var text_width = context.measureText(text).width;

    /// draw background rect assuming height of font
    context.fillRect(x, y, width, parseInt("30pt Calibri", 10));

    //context.font = "30pt Calibri";
    context.textAlign = "center";
    //context.fillRect(0,0,width, height);
    context.fillStyle = "#000000";
    context.fillText(text, x, y);
    var strDataURI = canvas.toDataURL("image/jpeg");
    var imag = new Image();
    imag.src = strDataURI;

    console.log(imag.src);

    return imag.src;
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
   alert(this.selectedLT);
   alert(this.selectedTimeStep);
   }

}


