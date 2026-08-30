import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SmartTable } from './smart-table';
import { provideAppIcons } from '../../icons/icon.registry';
import { TableColumn } from '../../../core/types/table.type';
import { TableLazyEvent } from '../../../core/types/table.type';

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
  load: number;
}

describe('SmartTable', () => {
  let fixture: ComponentFixture<SmartTable<Row>>;
  let component: SmartTable<Row>;

  const columns: TableColumn<Row>[] = [
    { field: 'name', header: 'Nome', sortable: true },
    { field: 'load', header: 'Carga', type: 'percent' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartTable],
      providers: [provideRouter([]), provideAppIcons(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartTable<Row>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('converte o evento lazy do PrimeNG (0-based) para page 1-based', () => {
    const emitted: TableLazyEvent[] = [];
    component.lazyLoad.subscribe((e) => emitted.push(e));

    // segunda página (first=10, rows=10) => page 2
    (component as unknown as { onLazyLoad: (e: unknown) => void }).onLazyLoad({
      first: 10,
      rows: 10,
      sortField: 'name',
      sortOrder: -1,
    });

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({
      page: 2,
      pageSize: 10,
      sortField: 'name',
      sortOrder: 'desc',
    });
  });

  it('emite ação de linha com a chave e a linha correta', () => {
    const row: Row = { id: '1', name: 'app', load: 20 };
    let received: { key: string; row: Row } | undefined;
    component.action.subscribe((e) => (received = e));

    (component as unknown as {
      onAction: (k: string, r: Row, e: Event) => void;
    }).onAction('view', row, new Event('click'));

    expect(received).toEqual({ key: 'view', row });
  });

  it('resolve valor de célula via getter customizado', () => {
    const col: TableColumn<Row> = {
      field: 'name',
      header: 'Nome',
      value: (r) => r.name.toUpperCase(),
    };
    const result = (component as unknown as {
      cellValue: (c: TableColumn<Row>, r: Row) => unknown;
    }).cellValue(col, { id: '1', name: 'app', load: 0 });

    expect(result).toBe('APP');
  });
});
