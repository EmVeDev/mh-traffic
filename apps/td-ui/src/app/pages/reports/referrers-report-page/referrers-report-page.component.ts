import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MhdCheckboxComponent,
  MhdFilterActionsComponent,
  MhdFilterFieldComponent,
  MhdFilterPanelComponent,
  MhdMultiSelectComponent,
  MhdSelectComponent,
} from '@mh-traffic/mh-design';
import { ReportPageShellComponent } from '../../../features/report-page-shell/report-page-shell.component';
import { ReferrersReportPageDataStore } from './referrers-report-page.data-store';
import { ReferrersReportPageStore } from './referrers-report-page.store';

@Component({
  selector: 'td-referrers-report-page',
  standalone: true,
  imports: [
    ReportPageShellComponent,
    MhdCheckboxComponent,
    MhdFilterActionsComponent,
    MhdFilterFieldComponent,
    MhdFilterPanelComponent,
    MhdMultiSelectComponent,
    MhdSelectComponent,
  ],
  providers: [ReferrersReportPageDataStore, ReferrersReportPageStore],
  templateUrl: './referrers-report-page.component.html',
  styleUrl: './referrers-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferrersReportPageComponent {
  readonly store = inject(ReferrersReportPageStore);
}
