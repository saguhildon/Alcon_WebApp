import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { FileService } from '../file.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ChartComponent,
  ApexXAxis,
  ApexGrid,
  ApexTooltip,
  ApexNoData
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  tooltip:ApexTooltip;
  legend:ApexLegend;
  noData:ApexNoData;
  //colors: any;
};

const uri = 'http://localhost:4200/ file/upload';
@Component({
  selector: 'analysis-new',
  templateUrl: './analysis-new.component.html',
  styleUrls: ['./analysis-new.component.scss'],
  providers:[FileService]
})
export class AnalysisNewComponent implements OnInit {
  uploader:FileUploader = new FileUploader({url:uri});

  attachmentList:any = [];
  file: File;
  filename: string;
  public LT: Array<string> = ["LT01","LT02",];
  public TimeStep: Array<string> = ["1","2","3","4","5",];
  public ST: Array<string> = ["Magazine","Filming"];

  public selectedLT = "LT01";
  public chartOptions: Partial<ChartOptions>;
  public datepipe: DatePipe = new DatePipe('en-US');
  public start_date: Date = new Date("2019-03-1");
  public new_date: Date = new Date("2019-03-30");
  public end_date: Date = new Date("2019-03-7");
  public selectedStation = "Film Station";
  dateRange1 = [new Date("2022-05-22"), new Date("2022-05-25")]
  dateRange2 = [new Date("2022-05-22"), new Date("2022-05-25")]

  public normal_samples:any;
  public fail_samples:any;
  public predicted_correctly:any;
  public overall_accuracy:any;
  public operation_time:any;
  public pdnormal_samples:any;
  public pdfail_samples:any;

  btnCompareDisabled=false;
  btnPredictDisabled=false;

  public value: Date;
  constructor(private _fileService:FileService,private httpClient: HttpClient){

      this.uploader.onCompleteItem = (item:any, response:any , status:any, headers:any) => {
          this.attachmentList.push(JSON.parse(response));
      }
  }

  download(index){
      var filename = this.attachmentList[index].uploadname;

      /*this._fileService.downloadFile(filename)
      .subscribe(
          data => saveAs(data, filename),
          error => console.error(error)
      );*/
  }
  ngAfterViewInit(): void {
    this.loadHeatMapDataInit();
  }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
          height: 150,
          width:400,
          type: 'heatmap',
      },
      dataLabels: {
          enabled: false
      },
      series: [],
      title: {
          text: 'Ajax Example',
      },
      noData: {
        text: 'Loading...'
      }
    }
  }

  loadHeatMapDataInit() {
    this.loadHeatMapData(this.start_date, this.end_date);
  }

  loadHeatMapData(startdate, enddate) {

    //var formData: FormData = new FormData();
    //formData.append('LT', '1');
    //formData.append('STATION', this.machinename);
    //formData.append('FROMD', datepipe.transform(startdate, 'YYYY-MM-dd HH:mm:ss'));
    //formData.append('TOD', datepipe.transform(enddate, 'YYYY-MM-dd HH:mm:ss'));

    var json_data = {};
    json_data["LT"] = '1';
    json_data["STATION"] = this.selectedStation //this.machinename;
    json_data["FROMD"] = this.datepipe.transform(startdate, 'YYYY-MM-dd HH:mm:ss');
    json_data["TOD"] = this.datepipe.transform(enddate, 'YYYY-MM-dd HH:mm:ss');

    combineLatest([
      this.httpClient.post('http://20.188.105.191:8888/api/analize/historical', json_data)
    ]).subscribe(
      ([res_historical_data]) => {
        console.log(res_historical_data);

        var obj = JSON.parse(res_historical_data.toString());
        this.normal_samples = obj[0]['normalsam'];
        this.pdnormal_samples = obj[0]['pdnormalsam'];
        this.fail_samples = obj[0]['failsam'];
        this.pdfail_samples = obj[0]['pdfailsam'];
        this.predicted_correctly = obj[0]['correctpredict'];
        this.overall_accuracy = Math.round(obj[0]['overallaccurcy']);
        this.operation_time = this.normal_samples + this.fail_samples

        this.loadchart(res_historical_data);

      },(err) => {
        console.log(err);
      });
  }

  loadchart(jsondata){
    this.chartOptions = {
      series: [
        {
          name: "Actual",
          data: this.generateData(jsondata,"Actual")

        },
        {
          name: "Predicted",
          data: this.generateData(jsondata,"Predicted")
        },

      ],
      chart: {
        height: 150,
        type: "heatmap",
        toolbar: {
          show: false,
          tools: {
            download: false
          }
        },
         background: 'transparent',
         foreColor: '#fff'

      },
      dataLabels: {
        enabled: false,
        style:{
          fontSize: "20px"
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderRadius: 2,
          padding: 4,
          opacity: 0.9,
          borderWidth: 1,
          borderColor: '#fff'
        },
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [{
                from: 0.0,
                to: 0.9,
                color: '#00A100',
                name: 'Normal',
              },
              {
                from: 1.0,
                to: 1.9,
                color: '#128FD9',
                name: 'Fail',
              }
            ],
            min: 0,
            max: 1
          },
        }
      },
      stroke: {
        width: 1
      },
      legend: {
        fontSize: "20px"
      },

      xaxis: {
        type: 'datetime',
        labels: {
          rotate: -45,
          datetimeUTC: false,
          format: 'dd MMM yyyy hh:mm:ss',
          style: {
            fontSize: "15px",
          },

        },
      },
      tooltip:{
           shared: false,
        intersect: true,
        x: {
          format: 'dd MMM yyyy hh:mm:ss'
        },

        y: {
          formatter: function(value, {series, seriesIndex, dataPointIndex, w }) {
            var tooltiptext="";

           // console.log(w.config.series[seriesIndex].name);
             if(value ==0 && w.config.series[seriesIndex].name =="Actual"){
              tooltiptext = "Normal";
              return  tooltiptext
             }
             else if(value ==0 && w.config.series[seriesIndex].name =="Predicted"){
              tooltiptext = "Normal";
              return  tooltiptext
             }
             else if(value ==1 && w.config.series[seriesIndex].name =="Actual"){
               tooltiptext = "Fail";
               return  tooltiptext
             }
             else if(value ==1 && w.config.series[seriesIndex].name =="Predicted"){
              tooltiptext = "Fail" ;
              return  '<div>' + tooltiptext + '</div>'


            }

          }
        },
      }

    };


  }

  public generateData(Jsondataarray,yaxislabel) {
    var series = [];
    if(yaxislabel =="Predicted"){
      JSON.parse(Jsondataarray).forEach(element => {
        series.push({
          x: (element.predicted_start_time),
          y: (element.predicted_machine_condition =='Normal' ? 0 : 1)
        });
      });
    }
    else{
      JSON.parse(Jsondataarray).forEach(element => {
        series.push({
          x: (element.predicted_start_time),
          y: (element.machine_condition =='Normal' ? 0 : 1)
        });
      });
    }
    return series;
  }

  Predict() {

    this.btnCompareDisabled=true;
    this.btnPredictDisabled=false;
  }
  Compare() {
    this.btnCompareDisabled=false;
    this.btnPredictDisabled=false;
  }


  downloadSample() {
    let link = document.createElement('a');
    link.download = 'ImportFormat';
    link.href = 'assets/excels/importFormat.xlsx';
    link.click();
  }

  incomingfile(event) {
    this.file = event.target.files[0];

    this.filename = this.file.name;
    const filenameArr = this.file.name.split(".").slice(0, -1);
    const filenameStr = filenameArr.toString();
    this.filename = filenameStr;

  }

  afuConfig = {
    multiple: false,
    formatsAllowed: ".xlsx",
    maxSize: "100",
    uploadAPI:  {
      url:"https://slack.com/api/files.upload",
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    autoUpload: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };
};
