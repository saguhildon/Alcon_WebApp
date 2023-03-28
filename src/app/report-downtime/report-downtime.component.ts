import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { DowntimeService } from "src/downtime.service";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-report-downtime',
  templateUrl: './report-downtime.component.html',
  styleUrls: ['./report-downtime.component.scss']
})
export class ReportDowntimeComponent implements OnInit {
  downtimeList: any;
  public new_start_date: Date = new Date();
  public new_end_date: Date = new Date();
  public selectedLT = "LT01";
  public selectedStation = "Film Station";
  public selectedCategory = "Others";
  public value: Date;
  public startTime: Date = new Date(2000, 2, 10, 10, 30, 0);
  public endTime: Date = new Date(2000, 2, 10, 10, 30, 0);
  public disabledDates = (date: Date): boolean => {
    return !(date <= new Date() && date <= this.new_end_date) 
  };
  public disabledDates1 = (date: Date): boolean => {
    return !(date <= new Date() && date >= this.new_start_date) 
  };

  public format: FormatSettings = {
    displayFormat: "dd-MMM-yyyy",
    inputFormat: "dd/MM/yyyy",
  };

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

    public Categories: Array<string> = [
      "ACR - Automatic Cleaning Round",
      "ALC",
      "Annual PM",
      "Bi-Monthly PM",
      "Bi-Monthly PM - Full MRI",
      "Bi-Monthly PM - Peel Test",
      "Bi-Monthly PM - Performed Ozonization",
      "Bub > 0.95mm",
      "Bub with Tear",
      "Bubble with Schlieren",
      "BV Fatal Error",
      "BV Lamp Replacement",
      "BV Other Issue",
      "BV Yield Improvement",
      "Calibration Activities",
      "CT Control Cycle Monitoring",
      "CT Control Other Issue",
      "Delamination ",
      "Elevator Down Cycle Monitoring ",
      "Elevator Other Issue",
      "Elevator Up Cycle Monitoring",
      "Engineering Study Activities",
      "Film Feeding Cycle Monitoring",
      "Film Feeding Traction Motor Error",
      "Film Feeding Trim Press Cycle Monitoring",
      "Film Loader Cycle Monitoring",
      "Film Other Issue",
      "Film Vacuum Missing",
      "Formation Change",
      "Forming Other Issue",
      "Forming Swing Support Replacement",
      "Gapped Edge",
      "Gripper Cleaning & Drying Other Issue",
      "Humidity",
      "Improvement Activities",
      "IPI Cycle Monitoring",
      "IPI Cycle Time Improvement",
      "IPI Other Issue",
      "IPI Watchdog Error",
      "Laser Cycle Monitoring",
      "Laser Other Issue",
      "Laser Printing Improvement",
      "Laser Watchdog Error",
      "Legibility",
      "Lens Drying Timeout Sequence ",
      "Lens Drying Water Leakage ",
      "Lens Loosening Head Replacement",
      "Lens Loosening Other Issue",
      "Lens Loosening Valve Replacement",
      "Lens Transfer Other Issue",
      "Lenticular Tear",
      "Lifter Other Issue",
      "Lifter Reference CT Error",
      "Lifter Stopper Cycle Monitoring",
      "LSI Other Issue",
      "LT Non Categorized Others",
      "Magazine Air Leak",
      "Magazine Infeed Cycle Monitoring",
      "Magazine Other Issue",
      "Magazine Outfeed Cycle Monitoring",
      "Magazine Stacking Cycle Monitoring ",
      "Magazine Tongue Replacement",
      "Magazine Transfer Transverse Vertical ",
      "Major A Others",
      "Mark on Seal Area",
      "MES / SCADA Connection Interrupt Error",
      "MES / SCADA Down",
      "MES / SCADA Not Release Magazine Data ",
      "MES / SCADA Other Issue",
      "MLC",
      "MLCS",
      "Mold Chip",
      "MTSU Activities",
      "Multi Bubbles",
      "NCR Action Taken",
      "No Contact Lens",
      "Non-Categorized Others",
      "Others",
      "Particle on Seal Area",
      "Perforation",
      "Planned Downtimes Others",
      "Planned Shutdown",
      "PLC Other Issue",
      "PP Line Control Voltage Off",
      "Printing Other Issue",
      "Prism",
      "Product Loader Cycle Monitoring",
      "Product Loader Other Issue",
      "Product Loader Timeout Sequence ",
      "Profibus Other Issue",
      "PVA Dosing Air Leakage",
      "PVA Dosing Other Issue",
      "PVA Dosing Pneumatic Axis",
      "PVA Dosing Pump Replacement ",
      "PVA Dosing Timeout Sequence ",
      "PVA Dosing Tip Replacement",
      "PVA Inclusion",
      "QA Sampling Reference CT Error",
      "Reference CT Error",
      "Rotan Not Ready",
      "Saline Dosing Level Issue",
      "Saline Dosing Other Issue",
      "Saline Dosing Peristaltic Pump Error",
      "Saline Level",
      "Seal Leakage",
      "Seal Width",
      "Sealing Force Verification",
      "Sealing Other Issue",
      "Sealing Row Replacement",
      "Sealing Track Cycle Monitoring",
      "Semi Annual PM",
      "Several CLs",
      "Shell Control Cycle Monitoring",
      "Shell Feeding Is In Reset",
      "Shell Feeding Other Issue",
      "Shell Height Control Other Issue",
      "Shell Loader Cycle Monitoring",
      "Shell Loader Other Issue",
      "Shell Loader Vacuum Missing",
      "Stargripper Other Issue",
      "Stargripper Tip / Ring Replacement",
      "Stargripper Vacuum Fault",
      "Surface Imperfection",
      "Tool Cleaning Other Issue",
      "Tool Cleaning Timeout Sequence", 
      "Tool Crash Danger",
      "Tool Drying Other Issue",
      "Tool Opening Motor Fault",
      "Tool Opening Other Issue",
      "Tool Opening Timeout Sequence ",
      "Tool Transport Index / Drawrod Issues",
      "Tool Transport Laser Scanner",
      "Tool Transport Limit Switch Error",
      "Tool Transport Other Issue",
      "Tool Transport Timeout Sequence ",
      "Torn Strip",
      "Transport Belt Object Chain",
      "Ultrasonic Cycle Monitoring",
      "Underdose",
      "UV Lamp Replacement",
      "UV Measurement Error",
      "UV Other Issue",
      "Validation Activities",
      "Vibratory Bowl Other Issues",
    ];

  constructor(private downtimeService : DowntimeService) { }

  exform: FormGroup;

  ngOnInit() {

    this.exform = new FormGroup({
      'start_date' : new FormControl(null, Validators.required),
      'start_time' : new FormControl(null, Validators.required),
      'end_date' : new FormControl(null, Validators.required),
      'end_time' : new FormControl(null, Validators.required),
      'name' : new FormControl(null, Validators.required),
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'phone' : new FormControl(
        null,
        [
          Validators.required,
          Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')
        ]),
      'message' : new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'category' : new FormControl(null, Validators.required),
      'lt' : new FormControl(null, Validators.required),
      'station' : new FormControl(null, Validators.required),
    });
    this.downtimeService.getLists().subscribe((downtimeList: any[]) => {
      console.log(downtimeList);
      this.downtimeList = downtimeList;
    })
  }

  clicksub() {
    console.log(this.exform.value);
    alert("Downtime report from " + this.exform.get('name').value + " submitted successfully!");
    this.exform.reset();
  }
  get start_date() {
    return this.exform.get('start_date');
  }
  get start_time() {
    return this.exform.get('start_time');
  }
  get end_date() {
    return this.exform.get('end_date');
  }
  get end_time() {
    return this.exform.get('end_time');
  }
  get name() {
    return this.exform.get('name');
  }
  get email() {
    return this.exform.get('email');
  }
  get phone() {
    return this.exform.get('phone');
  }
  get message() {
    return this.exform.get('message');
  }
  get lt() {
    return this.exform.get('lt');
  }
  get station() {
    return this.exform.get('station');
  }
  get category() {
    return this.exform.get('category');
  }

  //Disable the kendo drop down
  public itemDisabled(itemArgs: { dataItem: string, index: number }) {
    return itemArgs.index != 0; // disable the 3rd item
  }

  submit() {
    console.log(this.exform.value);
    this.downtimeService.createList(this.exform.get('lt').value, 
      this.exform.get('station').value,
      this.exform.get('start_date').value,
      this.exform.get('end_date').value,
      this.exform.get('name').value,
      this.exform.get('email').value,
      this.exform.get('phone').value,
      this.exform.get('category').value,
      this.exform.get('message').value
      ).subscribe((response: any) => {
      console.log(response);
    });
    alert("Downtime report from " + this.exform.get('name').value + " submitted successfully!");
  }


}
