import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { UserAvatar } from './user-avatar';
import { provideAppIcons } from '../../icons/icon.registry';

describe('UserAvatar', () => {
  let component: UserAvatar;
  let fixture: ComponentFixture<UserAvatar>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserAvatar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideNoopAnimations(),
        provideAppIcons(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('inicia sem dialog aberto', () => {
    expect(component.mode()).toBeNull();
  });

  it('abre o dialog de senha com título correto', () => {
    component.open('password');
    expect(component.mode()).toBe('password');
    expect(component.dialogTitle()).toBe('Alterar senha');
  });

  it('fecha o dialog', () => {
    component.open('data');
    component.close();
    expect(component.mode()).toBeNull();
  });
});
