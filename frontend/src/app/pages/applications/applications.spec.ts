import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Applications } from './applications';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('Applications', () => {
  let component: Applications;
  let fixture: ComponentFixture<Applications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Applications],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideNoopAnimations(),
        provideAppIcons(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Applications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('define as 8 colunas de referência do rollout', () => {
    const headers = (component as unknown as { columns: { header: string }[] }).columns.map(
      (c) => c.header,
    );
    expect(headers).toEqual([
      'Repositório',
      'Versão',
      'Rollout',
      'Carga',
      'Estado',
      'Público',
      'GMUD',
      'Atualizado em',
    ]);
  });
});
