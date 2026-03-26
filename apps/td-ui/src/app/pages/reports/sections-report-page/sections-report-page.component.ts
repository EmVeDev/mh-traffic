import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MhdFilterActionsComponent,
  MhdFilterFieldComponent,
  MhdFilterPanelComponent,
  MhdMultiSelectComponent,
  MhdSelectComponent,
} from '@mh-traffic/mh-design';
import { ReportPageShellComponent } from '../../../features/report-page-shell/report-page-shell.component';
import { SectionsReportPageDataStore } from './sections-report-page.data-store';
import { SectionsReportPageStore } from './sections-report-page.store';

@Component({
  selector: 'td-sections-report-page',
  standalone: true,
  imports: [
    ReportPageShellComponent,
    MhdFilterActionsComponent,
    MhdFilterFieldComponent,
    MhdFilterPanelComponent,
    MhdMultiSelectComponent,
    MhdSelectComponent,
  ],
  providers: [SectionsReportPageDataStore, SectionsReportPageStore],
  templateUrl: './sections-report-page.component.html',
  styleUrl: './sections-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsReportPageComponent {
  readonly store = inject(SectionsReportPageStore);
}
