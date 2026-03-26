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
import { SectionDetailPageDataStore } from './section-detail-page.data-store';
import { SectionDetailPageStore } from './section-detail-page.store';

@Component({
  selector: 'td-section-detail-page',
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
  providers: [SectionDetailPageDataStore, SectionDetailPageStore],
  templateUrl: './section-detail-page.component.html',
  styleUrl: './section-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDetailPageComponent {
  readonly store = inject(SectionDetailPageStore);
}
