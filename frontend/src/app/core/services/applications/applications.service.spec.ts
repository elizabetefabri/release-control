import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ApplicationsService } from './applications.service';
import { defaultQuery } from '../../types/query.type';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApplicationsService);
  });

  it('retorna dados mock paginados (feature-toggle mock ligado em dev)', (done) => {
    service.list(defaultQuery('applications')).subscribe((page) => {
      expect(page.items.length).toBeGreaterThan(0);
      expect(page.items.length).toBeLessThanOrEqual(10);
      expect(page.pagination.total).toBeGreaterThan(0);
      done();
    });
  });

  it('aplica busca no mock', (done) => {
    service.list({ ...defaultQuery('applications'), search: 'pix' }).subscribe((page) => {
      expect(page.items.every((r) => r.repositoryName.includes('pix'))).toBe(true);
      done();
    });
  });
});
