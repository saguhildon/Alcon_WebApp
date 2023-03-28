import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicator-custom-sample',
  templateUrl: './indicator-custom-sample.component.html',
  styleUrls: ['./indicator-custom-sample.component.scss']
})
export class IndicatorCustomSampleComponent implements OnInit {
  @Input() name: string;
  @Input() group: string;
  @Input() callout: string;
  @Input() details: string[];

  constructor() {}

  ngOnInit(): void {}
}
