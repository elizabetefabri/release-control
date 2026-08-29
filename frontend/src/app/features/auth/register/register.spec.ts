import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Register } from './register';
import { provideAppIcons } from '../../../shared/icons/icon.registry';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideNoopAnimations(),
        provideAppIcons(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('valida senhas diferentes', () => {
    component.form.setValue({
      name: 'Teste',
      email: 'teste@itau.com',
      phone: '',
      password: '123456',
      confirm: '654321',
    });
    expect(component.form.errors?.['mismatch']).toBe(true);
  });
});
