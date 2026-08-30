import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-dashboard-red',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './dashboard-red.html',
  styleUrl: './dashboard-red.scss',
})
export class DashboardRed {}
