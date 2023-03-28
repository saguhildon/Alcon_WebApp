import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { FileService } from '../file.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { State, process, filterBy } from '@progress/kendo-data-query';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';
import { ValueAxisLabels } from "@progress/kendo-angular-charts";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { NgxSpinnerService } from 'ngx-spinner';

type AOA = any[][];
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
  tooltip: ApexTooltip;
  legend: ApexLegend;
  noData: ApexNoData;
  //colors: any;
};

const uri = 'http://localhost:4200/ file/upload';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [FileService]
})
export class UploadComponent implements OnInit {
  uploader: FileUploader = new FileUploader({ url: uri });
  header = ['station', 'predicted_start_time', 'predicted_end_time', 'predicted_machine_condition', 'prediction_confidence'];
  attachmentList: any = [];

  gridState: State = {

    skip: 0,
    take: 2,
  };

  file: File;
  filename: string;
  public LT: Array<string> = ["LT01"];
  public TimeStep: Array<string> = ["1", "2", "3", "4", "5",];
  public ST: Array<string> = ["Magazine", "Film"];

  public selectedLT: any;
  public chartOptions: Partial<ChartOptions>;
  public datepipe: DatePipe = new DatePipe('en-US');
  public start_date: Date;
  public new_date: Date;
  public end_date: Date;
  public selectedStation = "Film Station";
  dateRange1 = [new Date("2022-05-22"), new Date("2022-05-25")]
  dateRange2 = [new Date("2022-05-22"), new Date("2022-05-25")]
  public format: FormatSettings = {
    displayFormat: "dd-MMM-yyyy",
    inputFormat: "dd/MM/yyyy",
  };

  public disabledDates = (date: Date): boolean => {
    return !(date >= this.dateRange1[0] && date <= this.dateRange1[1])
  };

  public disabledDates2 = (date: Date): boolean => {
    return !(date >= this.dateRange2[0] && date <= this.dateRange2[1])
  };
  public normal_samples: any;
  public fail_samples: any;
  public predicted_correctly: any;
  public overall_accuracy: any;
  public operation_time: any;
  public pdnormal_samples: any;
  public pdfail_samples: any;

  public station: any;
  public LT_unique: any;
  public startdate: any;
  public enddate: any;
  public result: any;
  public gridData: any;
  public gridDataOriginal: any;
  public showheatmap: any = false;
  public showuploading: boolean = false;
  public showpredicting: boolean = false;
  btnPredictDisabled = true;
  btnUploadDisabled = true;
  public productionlineID: any = '';

  public value: Date;
  constructor(private _fileService: FileService, private httpClient: HttpClient, private spinner: NgxSpinnerService) {
    this.allData = this.allData.bind(this);
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.attachmentList.push(JSON.parse(response));
    }
  }

  public onStateChange(state: State) {
    this.gridState = state;
  }
  // Method to download the file
  download(index) {
    var filename = this.attachmentList[index].uploadname;

    /*this._fileService.downloadFile(filename)
    .subscribe(
        data => saveAs(data, filename),
        error => console.error(error)
    );*/
  }
  ngAfterViewInit(): void {
    //this.loadHeatMapDataInit();
  }

  ngOnInit(): void {
    this.btnUploadDisabled = false;
    this.btnPredictDisabled = true;
    this.chartOptions = {
      chart: {
        height: 150,
        width: 400,
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
  // Load Heat Map chart start
  loadHeatMapDataInit() {
    this.loadHeatMapData(this.start_date, this.end_date);
  }

  loadHeatMapData(startdate, enddate) {
    console.log("oooo")
    console.log(new Date(startdate))
    let filteredjson = this.gridData.filter(item => {
      let date = new Date(item.predicted_start_time);
      let id = parseInt(item.LT);
      return date >= new Date(startdate) && date <= new Date(enddate) && id == this.productionlineID;
    });
    console.log(JSON.stringify(filteredjson));
    this.loadchart(filteredjson);
  }


  loadchart(jsondata) {
    console.log('loadchart' + jsondata);
    this.chartOptions = {
      series: [
        {
          name: "Magazine",
          data: this.generateData(jsondata, "Magazine")

        },
        {
          name: "Film",
          data: this.generateData(jsondata, "Film")
        },

      ],
      chart: {
        zoom: {
          enabled: true
        },
        height: 150,
        type: "heatmap",
        toolbar: {
          show: false,
          tools: {
            download: false
          }
        },
        background: 'transparent',
        foreColor: '#fff',


      },
      dataLabels: {
        enabled: false,
        style: {
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
        fontSize: "12px"
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
      tooltip: {
        shared: false,
        intersect: true,
        x: {
          format: 'dd MMM yyyy hh:mm:ss'
        },

        y: {
          formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            var tooltiptext = "";

            // console.log(w.config.series[seriesIndex].name);
            if (value == 0 && w.config.series[seriesIndex].name == "Magazine") {
              tooltiptext = "Normal";
              return tooltiptext
            }
            else if (value == 0 && w.config.series[seriesIndex].name == "Film") {
              tooltiptext = "Normal";
              return tooltiptext
            }
            else if (value == 1 && w.config.series[seriesIndex].name == "Magazine") {
              tooltiptext = "Fail";
              return tooltiptext
            }
            else if (value == 1 && w.config.series[seriesIndex].name == "Film") {
              tooltiptext = "Fail";
              return '<div>' + tooltiptext + '</div>'


            }

          }
        },
      }

    };
  }

  // Load Heat Map chart End

  public generateData(Jsondataarray, yaxislabel) {
    var series = [];
    (Jsondataarray).forEach(element => {
      if (yaxislabel == element.station) {
        series.push({
          x: (element.predicted_start_time),
          y: (element.predicted_machine_condition == 'Normal' ? 0 : 1)
        });
      }
    });
    console.log(yaxislabel);
    console.log(JSON.stringify(series))

    return series;
  }

  public onChangeStartDate(value: Date): void {
    console.log(value);
    this.new_date = new Date(value.getTime() + (1000 * 60 * 60 * 24 * 4));
    this.end_date = this.new_date;
    this.loadHeatMapData(value, this.end_date);
  }

  public onChangeEndtDate(value: Date): void {
    console.log(value);
    this.new_date = new Date(value.getTime() - (1000 * 60 * 60 * 24 * 4));
    this.start_date = this.new_date
    this.loadHeatMapData(this.start_date, value);
    
  }

  // Validation Method
  Check() {
    this.spinner.show();
    this.showuploading = true;
    this.showpredicting = false;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      console.log('target', wb.SheetNames);
      const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
      /* save data */
      const sheetRawData = <AOA>(
        XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd',
        })
      );


      const [keys, ...values] = sheetRawData;
      const objects = values.map(sheetRawData => sheetRawData.reduce((a, v, i) => ({ ...a, [keys[i]]: v }), {}));

      this.startdate = objects[1]["TIMESTART"]
      this.start_date = new Date(this.datepipe.transform(this.startdate, 'MM/dd/yyyy'));
      this.enddate = objects[objects.length - 1]["TIMEEND"]
      this.new_date = new Date(new Date(this.startdate).getTime() + (1000 * 60 * 60 * 24 * 4));
      this.end_date = new Date(this.datepipe.transform(this.new_date, 'MM/dd/yyyy'));
      this.dateRange1 = [new Date(this.startdate), new Date(this.enddate)]
      this.dateRange2 = [new Date(this.startdate), new Date(this.enddate)]
      this.LT_unique = [...new Set(objects.map(item => item.MODULNO))];
      this.selectedLT = this.LT_unique[0];
      var numb = this.selectedLT.match(/\d/g);
      numb = parseInt(numb.join(""));
      this.productionlineID = numb;
      const station_temp = [...new Set(objects.map(item => item.STATION))];

      if (station_temp.includes('magazine_infeed') || station_temp.includes('magazine_stacking') || station_temp.includes('magazine_transfer') || station_temp.includes('magazine_outpusher')) {

        this.station = " Magazine, "

      }

      if (station_temp.includes('filmfeeding') || station_temp.includes('filmloader')) {

        this.station += " Film "

      }
      const formattedData = this.formatTable(sheetRawData);
      const headerRow = sheetRawData[0];
      this.upload();


    };
    reader.readAsBinaryString(this.file);
    this.btnUploadDisabled = true;
    this.btnPredictDisabled = false;
  }
  private formatTable(sheetData) {
    var i = 0;
    var headerRow = sheetData[0];
    const records = [];
    for (i = 1; i < sheetData.length; i++) {
      let row = {};
      var j = 0;
      for (j = 0; j < headerRow.length; j++) {
        if (headerRow[j] === 'No') {
          row[headerRow[j]] = Number(sheetData[i][j]);
        } else {
          row[headerRow[j]] = sheetData[i][j];
        }


      }

      records.push(row);
    }
    return records;
  }
  // Call Upload API
  upload() {

    const fileInput = document.querySelector('input[type="file"]');
    const selectedFile = (<HTMLInputElement>fileInput).files[0];
    const formData = new FormData();

    formData.append("file", selectedFile, selectedFile.name);

    this.httpClient.post(environment.API + 'api/file-upload', formData).subscribe((res: any) => {
      this.spinner.hide();
      this.showuploading = false;
      this.showpredicting = false;
      console.log('save data', res);

      alert("Successfully Uploaded!");
    }, err => {
      console.error(err);
      alert('Error occurred in saving data');
    });
  }
  // Call Prediction API
  Predict() {
    this.spinner.show();
    this.showuploading = false;
    this.showpredicting = true;
    this.httpClient.get(environment.API + 'api/prediction').subscribe((res: any) => {
      console.log('prediction data', JSON.stringify(res));
      res = res.sort((a, b) => (a.predicted_start_time > b.predicted_start_time) ? 1 : -1);
      this.spinner.hide();
      this.showuploading = false;
      this.showpredicting = false;
      this.showheatmap = true;
      var filteredgrid = filterBy(res, {
        logic: 'and',
        filters: [
          { field: "LT", operator: "eq", value: this.productionlineID }

        ]
      });

      this.loadchart(filteredgrid.slice(0, 120));
      this.gridData = res;
      this.gridDataOriginal = res;

    }, err => {
      console.error(err);
      alert('Error occurred in saving data');
    });




  }

  downloadSample() {
    let link = document.createElement('a');
    link.download = 'ImportFormat.csv';
    link.href = 'assets/excels/ImportFormat.csv';
    link.click();
  }


  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        sort: [{ field: "No", dir: "asc" }],
      }).data,
    };

    return result;
  }


  incomingfile(event) {
    this.file = event.target.files[0];

    const filenameArr = this.file.name.split(".").slice(0, -1);
    const filenameStr = filenameArr.toString();
    this.filename = filenameStr;

  }
  public valueChange(value): void {
    console.log("valuechange");
    console.log(value);
    var numb = value.match(/\d/g);
    numb = parseInt(numb.join(""));
    this.productionlineID = numb;
    // alert (parseInt(numb));​
    var filteredgrid = filterBy(this.gridDataOriginal, {
      logic: 'and',
      filters: [
        { field: "LT", operator: "eq", value: this.productionlineID }

      ]
    });

    this.gridData = filteredgrid;
    this.loadchart(this.gridData.slice(0, 120));
  }

  afuConfig = {
    multiple: false,
    formatsAllowed: ".xlsx",
    maxSize: "100",
    uploadAPI: {
      url: "https://slack.com/api/files.upload",
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
