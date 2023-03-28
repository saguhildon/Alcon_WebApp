import { MocksLocalService } from '@dis/services/mocks/mocks.service';
import { Component, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, OnInit, Input } from '@angular/core';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ValueAxisLabels } from "@progress/kendo-angular-charts";
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
import { style } from '@angular/animations';

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



@Component({
  selector: 'app-historical-analysis',
  templateUrl: './historical-analysis.component.html',
  styleUrls: ['./historical-analysis.component.scss']
})

export class HistoricalAnalysisComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @Input() public substationname: string;
  public selectedLT = "LT01";
  public chartOptions: Partial<ChartOptions>;
  public datepipe: DatePipe = new DatePipe('en-US');
  public start_date: Date = new Date("2019-03-1");
  public new_date: Date = new Date("2019-03-30");
  public end_date: Date = new Date("2019-03-7");
  public selectedStation = "Film Station";
  dateRange1 = [new Date("2019-02-1"), new Date("2019-03-30")]
  dateRange2 = [new Date("2019-02-2"), new Date("2019-03-31")]

  public value: Date;

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

  public format: FormatSettings = {
    displayFormat: "dd-MMM-yyyy",
    inputFormat: "dd/MM/yyyy",
  };

  public charttitle3 = "Monthly Mean Breakdown \n Time for LT 01 (minutes)";

  public Station: Array<string> = [
    "Film Station",
    "Magazine Station",

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


  constructor(private httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.loadHeatMapDataInit();
  }

  ngOnInit(): void {

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

    var json_data = {};
    json_data["LT"] = '1';
    json_data["STATION"] = this.selectedStation //this.substationname;
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

      }, (err) => {
        console.log(err);
      });
  }

  loadchart(jsondata) {
    this.chartOptions = {
      series: [
        {
          name: "Predicted",
          data: this.generateData(jsondata, "Predicted")

        },
        {
          name: "Actual",
          data: this.generateData(jsondata, "Actual")
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
            if (value == 0 && w.config.series[seriesIndex].name == "Actual") {
              tooltiptext = "Normal";
              return tooltiptext
            }
            else if (value == 0 && w.config.series[seriesIndex].name == "Predicted") {
              tooltiptext = "Normal";
              return tooltiptext
            }
            else if (value == 1 && w.config.series[seriesIndex].name == "Actual") {
              tooltiptext = "Fail";
              return tooltiptext
            }
            else if (value == 1 && w.config.series[seriesIndex].name == "Predicted") {
              tooltiptext = "Fail";
              return '<div>' + tooltiptext + '</div>'


            }

          }
        },
      }

    };
  }

  public generateData(Jsondataarray, yaxislabel) {
    var series = [];
    if (yaxislabel == "Predicted") {
      JSON.parse(Jsondataarray).forEach(element => {
        series.push({
          x: (element.predicted_start_time),
          y: (element.predicted_machine_condition == 'Normal' ? 0 : 1)
        });
      });
    }
    else {
      JSON.parse(Jsondataarray).forEach(element => {
        series.push({
          x: (element.predicted_start_time),
          y: (element.machine_condition == 'Normal' ? 0 : 1)
        });
      });
    }
    return series;
  }


  public onChangeStartDate(value: Date): void {
    console.log(value);
    this.new_date = new Date(value.getTime() + (1000 * 60 * 60 * 24 * 6));
    this.end_date = this.new_date
    this.loadHeatMapData(value, this.end_date);
  }

  public onChangeEndtDate(value: Date): void {
    console.log(value);
    this.new_date = new Date(value.getTime() - (1000 * 60 * 60 * 24 * 6));
    this.start_date = this.new_date
    this.loadHeatMapData(this.start_date, value);
    // alert(this.start_date);
    // alert(this.end_date);
  }

  public valueChange(value: any): void {
    this.selectedStation = value;
    this.loadHeatMapData(this.start_date, this.end_date);
  }

  public valueAxisLabels: ValueAxisLabels = {
    font: "20px Arial, sans-serif",
    color: "white"
  };

  //Disable the kendo drop down
  public itemDisabled(itemArgs: { dataItem: string, index: number }) {
    return itemArgs.index != 0; // disable the 3rd item
  }
  // Load Heat Map chart End
}
