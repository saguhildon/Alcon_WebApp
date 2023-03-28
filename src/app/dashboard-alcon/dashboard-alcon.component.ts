import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-alcon',
  templateUrl: './dashboard-alcon.component.html',
  styleUrls: ['./dashboard-alcon.component.scss']
})
export class DashboardAlconComponent implements OnInit {
  public value: Date = new Date(2000, 2, 10);
  public listItems: Array<string> = [
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "2X-Large",
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
