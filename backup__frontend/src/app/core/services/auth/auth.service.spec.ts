import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated and non-admin', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isAdmin()).toBe(false);
    expect(service.token).toBeNull();
  });

  it('autentica com credenciais mock válidas (feature-toggle mock)', (done) => {
    service.login({ email: 'admin@itau.com', password: '123456' }).subscribe((session) => {
      expect(session.token).toContain('mock.');
      expect(service.isAuthenticated()).toBe(true);
      done();
    });
  });

  it('rejeita credenciais mock inválidas', (done) => {
    service.login({ email: 'naoexiste@itau.com', password: 'errada' }).subscribe({
      error: (err: unknown) => {
        expect(err).toBeInstanceOf(Error);
        expect(service.isAuthenticated()).toBe(false);
        done();
      },
    });
  });
});
