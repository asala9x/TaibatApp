import { TestBed } from '@angular/core/testing';

import { LoadingserviceServiceService } from './loadingservice-service.service';

describe('LoadingserviceServiceService', () => {
  let service: LoadingserviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingserviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
