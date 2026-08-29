import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-applications-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './applications-detail.html',
  styleUrl: './applications-detail.scss',
})
export class ApplicationsDetail {}
