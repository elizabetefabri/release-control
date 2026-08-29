import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { PageHeader } from './page-header';
import { provideAppIcons } from '../../icons/icon.registry';

describe('PageHeader', () => {
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
      providers: [provideAppIcons(), provideNoopAnimations(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    fixture.componentRef.setInput('title', 'Release Train');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza o título recebido por input', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.page-header__title')?.textContent).toContain('Release Train');
  });

  it('exibe o perfil quando informado', () => {
    fixture.componentRef.setInput('profile', 'Dev');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.page-header__profile')?.textContent).toContain('Perfil: Dev');
  });

  it('oculta a segunda linha quando showToolbarRow = false', () => {
    fixture.componentRef.setInput('showToolbarRow', false);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.page-header__search')).toBeNull();
  });
});
