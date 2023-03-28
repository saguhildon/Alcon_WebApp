import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { data as sampleDataForGrid } from './sampleDataForGrid';

@Injectable()
export class MocksService {
  constructor(private _http: HttpClient) {}

  getPosts() {
    return this._http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable()
export class MocksLocalService {
  constructor() {}

  getSampleDataForGrid(): any {
    return sampleDataForGrid;
  }

  // json-server alternative
}
