import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
//import { Downtime } from './models/downtime.model';

@Injectable({
  providedIn: 'root'
})
export class DowntimeService {

  constructor(private webReqService: WebRequestService) { }

  getLists() {
    return this.webReqService.get('downtimeLists');
  }

  createList(productionLine: String,stationName: String,startDate: Date,endDate: Date,name: String,email:String,phone: String,category: String,reason: String) {
    // We want to send a web request to create a list
    return this.webReqService.post('downtimeLists', { productionLine,stationName,startDate,endDate,name,email,phone,category,reason });
  }

}
