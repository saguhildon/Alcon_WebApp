import { Injectable, AfterViewInit} from '@angular/core';
import { NgZone } from '@angular/core'
import 'annyang';

declare var annyang: any;

@Injectable()
export default class SpeechService  {
  zone: NgZone;
  annyang: any = annyang;
  commands: any[] = [{
      "paint background :color": color => this.zone.run(() => {
        document.body.style.backgroundColor = color;
      })
  }];

  constructor(zone: NgZone) {
    this.init();
  }

  registerCommands = commands => this.annyang.addCommands(this.commands);
  
  init = (options: any = {}) => {
    this.registerCommands(this.commands);
    this.annyang.start(options);
  }

  listen = commands => {
    this.annyang.addCommands(this.commands);
    this.start();
  }

  unregister = (commands?) => this.annyang.removeCommands(commands);
  
  register = commands => this.annyang.addCommands(commands);

  start = (options?: any) => this.annyang.start(options);

}