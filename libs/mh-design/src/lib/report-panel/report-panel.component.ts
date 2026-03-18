import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mhd-report-panel',
  standalone: true,
  templateUrl: './report-panel.component.html',
  styleUrl: './report-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPanelComponent {
  public title = input<string>('');
}
