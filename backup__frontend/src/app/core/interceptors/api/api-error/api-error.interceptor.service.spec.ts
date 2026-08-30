import { TestBed } from '@angular/core/testing';

import { ApiErrorInterceptorService } from './api-error.interceptor.service';

describe('ApiErrorInterceptorService', () => {
  let service: ApiErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
