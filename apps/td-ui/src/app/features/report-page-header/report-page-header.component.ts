import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

@Component({
  selector: 'td-report-page-header',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './report-page-header.component.html',
  styleUrl: './report-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageHeaderComponent {
  readonly title = input.required<string>();
  readonly siteLabel = input.required<string>();
  readonly analysisTypeLabel = input.required<string>();
  readonly selectedDateLabel = input.required<string>();
}
