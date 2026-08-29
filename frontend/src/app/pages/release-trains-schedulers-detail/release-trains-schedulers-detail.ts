import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-release-trains-schedulers-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './release-trains-schedulers-detail.html',
  styleUrl: './release-trains-schedulers-detail.scss',
})
export class ReleaseTrainsSchedulersDetail {}
