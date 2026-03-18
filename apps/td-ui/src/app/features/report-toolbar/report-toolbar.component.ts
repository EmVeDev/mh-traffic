import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

export interface ReportToolbarToken {
  label: string;
}

@Component({
  selector: 'td-report-toolbar',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './report-toolbar.component.html',
  styleUrl: './report-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportToolbarComponent {
  readonly tokens = input.required<ReportToolbarToken[]>();
  readonly middleLabel = input<string>('performance by');
}
