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
import { TagsReportPageDataStore } from './tags-report-page.data-store';
import { TagsReportPageStore } from './tags-report-page.store';

@Component({
  selector: 'td-tags-report-page',
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
  providers: [TagsReportPageDataStore, TagsReportPageStore],
  templateUrl: './tags-report-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsReportPageComponent {
  readonly store = inject(TagsReportPageStore);
}
