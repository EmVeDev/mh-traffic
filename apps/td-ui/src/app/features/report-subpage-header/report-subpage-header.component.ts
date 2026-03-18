import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MhdIconComponent } from '@mh-traffic/mh-design';

@Component({
  selector: 'td-report-subpage-header',
  standalone: true,
  imports: [RouterLink, MhdIconComponent],
  templateUrl: './report-subpage-header.component.html',
  styleUrl: './report-subpage-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSubpageHeaderComponent {
  readonly backLabel = input.required<string>();
  readonly backRoute = input.required<string>();
  readonly title = input.required<string>();
  readonly siteLabel = input.required<string>();
  readonly analysisTypeLabel = input.required<string>();
  readonly selectedDateLabel = input.required<string>();
}
