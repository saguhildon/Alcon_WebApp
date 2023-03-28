import { Component, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, OnInit,Input  } from '@angular/core';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { DatePipe } from '@angular/common';
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
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

@Component({
  selector: 'app-dashboard-dialog-popup',
  templateUrl: './dashboard-dialog-popup.component.html',
  styleUrls: ['./dashboard-dialog-popup.component.scss']
})
export class DashboardDialogPopupComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @Input() public substationname: string;

  public chartOptions: Partial<ChartOptions>;
  public datepipe: DatePipe = new DatePipe('en-US');
  public start_date: Date = new Date("2019-02-01");
  public end_date: Date = new Date("2019-03-31");

  public normal_samples:any;
  public fail_samples:any;
  public predicted_correctly:any;
  public overall_accuracy:any;

  public format: FormatSettings = {
    displayFormat: "dd-MMM-yyyy",
    inputFormat: "dd/MM/yyyy",
    };
    
  constructor(private httpClient: HttpClient) {
    
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
    this.loadHeatMapData(
      this.datepipe.transform(new Date(this.end_date.getTime() - (24*60*60*1000)), 'YYYY-MM-dd HH:mm:ss'), 
      this.datepipe.transform(new Date(this.end_date), 'YYYY-MM-dd HH:mm:ss'));
  }

  loadHeatMapData(startdate, enddate) {

    //var formData: FormData = new FormData();
    //formData.append('LT', '1');
    //formData.append('STATION', this.machinename);
    //formData.append('FROMD', datepipe.transform(startdate, 'YYYY-MM-dd HH:mm:ss'));
    //formData.append('TOD', datepipe.transform(enddate, 'YYYY-MM-dd HH:mm:ss'));

    var json_data = {};
    json_data["LT"] = '1';
    json_data["STATION"] = this.substationname;
    json_data["FROMD"] = this.datepipe.transform(startdate, 'YYYY-MM-dd HH:mm:ss');
    json_data["TOD"] = this.datepipe.transform(enddate, 'YYYY-MM-dd HH:mm:ss');

    combineLatest([
      this.httpClient.post('http://20.188.105.191:8888/api/analize/historical', json_data)
    ]).subscribe(
      ([res_historical_data]) => {
        console.log(res_historical_data);

        var obj = JSON.parse(res_historical_data.toString());
        this.normal_samples = obj[0]['normalsam'];  
        this.fail_samples = obj[0]['failsam'];
        this.predicted_correctly = obj[0]['correctpredict'];
        this.overall_accuracy = Math.round(obj[0]['overallaccurcy']);

        this.loadchart(res_historical_data);

      },(err) => {
        console.log(err);
      });
  }

  loadchart(jsondata){
    this.chartOptions = {
      series: [
        {
          name: "Predicted",
          data: this.generateData(jsondata,"Predicted")
        },
        {
          name: "Actual",
          data: this.generateData(jsondata,"Actual")
        }
      ],
      chart: {
        height: 150,
        width:400,
        type: "heatmap",
        toolbar: {
          show: false,
          tools: {
            download: false
          }
        },
        
      },
      dataLabels: {
        enabled: false
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
      
      title: {
        text: "Detailed Prediction Result Comparison"
      },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: -45,   
          datetimeUTC: false,   
          format: 'dd MMM yyyy hh:mm:ss',
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

  public onChangeStartDate(value: Date): void {
    console.log(value);
    this.loadHeatMapData(this.datepipe.transform(value, 'YYYY-MM-dd HH:mm:ss'), this.end_date);
  }

  public onChangeEndtDate(value: Date): void {
    console.log(value);
    this.loadHeatMapData(this.start_date, this.datepipe.transform(value, 'YYYY-MM-dd HH:mm:ss'));
    // alert(this.start_date);
     // alert(this.end_date);
  }

}
