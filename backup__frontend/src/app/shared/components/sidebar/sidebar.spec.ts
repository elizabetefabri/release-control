import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Sidebar } from './sidebar';
import { provideAppIcons } from '../../icons/icon.registry';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAppIcons(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expõe os três sublinks do Rollouts', () => {
    expect(component.rolloutLinks.map((l) => l.route)).toEqual([
      '/release-trains',
      '/applications',
      '/release-train-schedulers',
    ]);
  });

  it('monta grupos com sublinks (Quality Budget, Rollouts, Best testing)', () => {
    const grupos = component.navItems.filter((i) => i.links).map((i) => i.label);
    expect(grupos).toEqual(['Quality Budget', 'Rollouts', 'Best testing']);
  });

  it('abre e fecha o sidesheet de um grupo', () => {
    const rollouts = component.navItems.find((i) => i.label === 'Rollouts')!;
    expect(component.isOpen(rollouts)).toBe(false);
    component.toggleGroup(rollouts);
    expect(component.isOpen(rollouts)).toBe(true);
    component.closeGroup();
    expect(component.isOpen(rollouts)).toBe(false);
  });

  it('abrir um grupo fecha o anterior', () => {
    const rollouts = component.navItems.find((i) => i.label === 'Rollouts')!;
    const budget = component.navItems.find((i) => i.label === 'Quality Budget')!;
    component.toggleGroup(rollouts);
    component.toggleGroup(budget);
    expect(component.isOpen(budget)).toBe(true);
    expect(component.isOpen(rollouts)).toBe(false);
  });
});
