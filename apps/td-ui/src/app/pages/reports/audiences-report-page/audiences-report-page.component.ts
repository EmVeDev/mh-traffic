import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MhdFilterActionsComponent,
  MhdFilterFieldComponent,
  MhdFilterPanelComponent,
  MhdMultiSelectComponent,
  MhdSelectComponent,
} from '@mh-traffic/mh-design';
import { ReportPageShellComponent } from '../../../features/report-page-shell/report-page-shell.component';
import { AudiencesReportPageDataStore } from './audiences-report-page.data-store';
import { AudiencesReportPageStore } from './audiences-report-page.store';

@Component({
  selector: 'td-audiences-report-page',
  standalone: true,
  imports: [
    ReportPageShellComponent,
    MhdFilterActionsComponent,
    MhdFilterFieldComponent,
    MhdFilterPanelComponent,
    MhdMultiSelectComponent,
    MhdSelectComponent,
  ],
  providers: [AudiencesReportPageDataStore, AudiencesReportPageStore],
  templateUrl: './audiences-report-page.component.html',
  styleUrl: './audiences-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudiencesReportPageComponent {
  readonly store = inject(AudiencesReportPageStore);
}
