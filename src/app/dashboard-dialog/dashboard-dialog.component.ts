
import { Component, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, OnInit,Input  } from '@angular/core';
import { ChartsModule } from "@progress/kendo-angular-charts";
import {heatmap_Jsonarray2} from "../jsonmockupdatafile";
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
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
  ApexTooltip
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
  legend:ApexLegend
  //colors: any;
};

declare var kendo: any;

@Component({
  selector: 'app-dashboard-dialog',
  templateUrl: './dashboard-dialog.component.html',
  styleUrls: ['./dashboard-dialog.component.scss']
})
export class DashboardDialogComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    private data: Array<any>;
    private treeData: any;

    private treeMap: any;
    private tooltip: any;
    @Input() public substationname: string;
    public start_date: Date = new Date();
    public end_date: Date = new Date();
    public chartheading:any;
    public normal_samples:any;
    public fail_samples:any;
    public predicted_correctly:any;
    public overall_accuracy:any;
  
    public heatmap_Jsonarray:any =heatmap_Jsonarray2;
   constructor(public datePipe: DatePipe,private http: HttpClient) { 
    this.loadchart();
  }

  loadchart(){
    this.chartheading = this.datePipe.transform(this.start_date,'dd-MM-yyyy') + ' and ' + this.datePipe.transform(this.end_date,'dd-MM-yyyy');
    this.chartOptions = {
      series: [
        {
          name: "Predicted",
          data: this.generateData(this.heatmap_Jsonarray,"Predicted")
        },
        {
          name: "Actual",
          data: this.generateData(this.heatmap_Jsonarray,"Actual")
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
      //colors: ["#008FFB", "#8E44AD"],
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
        text: "Prediction Results of "+this.chartheading
      },
      // grid: {
      //   padding: {
      //     right: 20,
      //   }
      // },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: -45,   
          datetimeUTC: false,   
          format: 'dd MMM yyyy hh:mm:ss',
          // rotateAlways: true,
          // hideOverlappingLabels: true,   
        },
        
        // tickPlacement: 'on'
      },
      tooltip: {
          x: {
          format: 'dd MMM yyyy hh:mm:ss'
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
                var tooltiptext="";
         
           // console.log(w.config.series[seriesIndex].name);
             if(series[seriesIndex][dataPointIndex] ==0 && w.config.series[seriesIndex].name =="Actual"){
              tooltiptext = "Normal";             
              return (
                '<div class="arrow_box">' +
                '<span>' +
                '<span style="font-weight:bold">' + w.config.series[seriesIndex].name +
                ': ' + '</span>' +               
                tooltiptext +
                '</span>' +
                '</div>'
              )
             }
             else if(series[seriesIndex][dataPointIndex] ==0 && w.config.series[seriesIndex].name =="Predicted"){
              tooltiptext = "Normal";
              return (
                '<div class="arrow_box">' +
                '<span>' +
                '<span style="font-weight:bold">' + w.config.series[seriesIndex].name +
                ': ' + '</span>' +               
                tooltiptext +
                '</span>' +
                '</div>'
              )
             }
             else if(series[seriesIndex][dataPointIndex] ==1 && w.config.series[seriesIndex].name =="Actual"){
               tooltiptext = "Fail";
               return (
                '<div class="arrow_box">' +
                '<span>' +
                '<span style="font-weight:bold">' + w.config.series[seriesIndex].name +
                ': ' + '</span>' +                
                tooltiptext +
                '</span>' +
                '</div>'
              )
             }
             else if(series[seriesIndex][dataPointIndex] ==1 && w.config.series[seriesIndex].name =="Predicted"){
              tooltiptext = "Fail" ;
              var jsonarray = [];
              JSON.parse(heatmap_Jsonarray2).forEach(element => {      
                jsonarray.push(element);
                });               
              //console.log(jsonarray[dataPointIndex]['prediction_confidence']);             
              return (
                '<div class="arrow_box">' +
                '<span >' +
                '<span style="font-weight:bold">' + w.config.series[seriesIndex].name +
                ': ' + '</span>' +
                tooltiptext +
                '</span>' +
                '<div style="white-space: pre-wrap">' + '<span style="font-weight:bold">' + "Reason: " + '</span>' + '<span style="white-space: normal;display:block;width:150px;word-wrap:break-word;">' + jsonarray[dataPointIndex]['reasons'] + '</span>'+ '</div>' +
                '</div>'
                
              )
             
            }        
    
        }
      }
      // tooltip: {
      //   shared: false,
      //   intersect: true,
      //   x: {
      //     format: 'dd MMM yyyy hh:mm:ss'
      //   },

      //   y: {
      //     formatter: function(value, {series, seriesIndex, dataPointIndex, w }) {
      //       var tooltiptext="";
      //       var failuremsg = "Need Attention";
      //      // console.log(w.config.series[seriesIndex].name);
      //        if(value ==0 && w.config.series[seriesIndex].name =="Actual"){
      //         tooltiptext = "Normal";
      //         return  tooltiptext
      //        }
      //        else if(value ==0 && w.config.series[seriesIndex].name =="Predicted"){
      //         tooltiptext = "Normal";
      //         return  tooltiptext
      //        }
      //        else if(value ==1 && w.config.series[seriesIndex].name =="Actual"){
      //          tooltiptext = "Fail";
      //          return  tooltiptext
      //        }
      //        else if(value ==1 && w.config.series[seriesIndex].name =="Predicted"){
      //         tooltiptext = "Fail" ;
      //         return  '<div>' + tooltiptext + '</div>' +
      //                 '<div>' + "Reason:" + failuremsg + '</div>'
              
      //       }
            
      //     }
      //   }, 
      
      // },
      // legend: {
      //   position: 'right',
      //   height: 800,
      // },
         
    };
  }


  public generateData(Jsondataarray,yaxislabel) {  
    //alert(JSON.parse(test).length);
    var series = [];
    if(yaxislabel =="Predicted"){
      JSON.parse(Jsondataarray).forEach(element => {      
        series.push({
          x:(element.predicted_start_time),
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

 

  ngOnInit(): void {
    var arr = JSON.parse(this.heatmap_Jsonarray);

  this.normal_samples = JSON.parse(arr[0]['normalsam']);  
   this.fail_samples = arr[0]['failsam'];
   this.predicted_correctly = arr[0]['correctpredict'];
   this.overall_accuracy = Math.round(arr[0]['overallaccurcy']);
  }

  public onChange(value: Date): void {
   this.chartheading = this.datePipe.transform(this.start_date,'dd-MM-yyyy') + ' and ' + this.datePipe.transform(this.end_date,'dd-MM-yyyy');
   this.loadchart();
   // alert(this.start_date);
    // alert(this.end_date);
  }

}
