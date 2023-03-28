import { TestBed } from '@angular/core/testing';

import { DowntimeService } from './downtime.service';

describe('DowntimeService', () => {
  let service: DowntimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DowntimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
