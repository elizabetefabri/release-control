import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TableToolbar } from './table-toolbar';
import { provideAppIcons } from '../../../icons/icon.registry';

describe('TableToolbar', () => {
  let fixture: ComponentFixture<TableToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableToolbar],
      providers: [provideAppIcons(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TableToolbar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza as 5 ações por padrão', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('button').length).toBe(5);
  });

  it('"Pausar release" vem desabilitado por padrão', () => {
    const el: HTMLElement = fixture.nativeElement;
    const pausar = Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Pausar release'),
    );
    expect(pausar?.hasAttribute('disabled')).toBe(true);
  });

  it('permite customizar os labels via input', () => {
    fixture.componentRef.setInput('rescheduleLabel', 'Reagendar');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Reagendar');
  });
});
