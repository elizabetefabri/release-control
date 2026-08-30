import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-release-trains-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './release-trains-detail.html',
  styleUrl: './release-trains-detail.scss',
})
export class ReleaseTrainsDetail {}
