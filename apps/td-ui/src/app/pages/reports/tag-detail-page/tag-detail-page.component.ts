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
import { TagDetailPageDataStore } from './tag-detail-page.data-store';
import { TagDetailPageStore } from './tag-detail-page.store';

@Component({
  selector: 'td-tag-detail-page',
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
  providers: [TagDetailPageDataStore, TagDetailPageStore],
  templateUrl: './tag-detail-page.component.html',
  styleUrl: './tag-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDetailPageComponent {
  readonly store = inject(TagDetailPageStore);
}
