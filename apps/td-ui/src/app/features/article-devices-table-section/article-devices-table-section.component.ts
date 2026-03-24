import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface DeviceRow {
  id: string;
  label: string;
  reads: number;
  totalPageviews: number;
  subscriberAttentionTime: number;
  subscriberMedianAttention: string;
}

@Component({
  selector: 'td-article-devices-table-section',
  standalone: true,
  imports: [FormsModule, MhdIconComponent],
  templateUrl: './article-devices-table-section.component.html',
  styleUrl: './article-devices-table-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDevicesTableSectionComponent {
  readonly searchTerm = signal('');

  readonly rows = signal<DeviceRow[]>([
    {
      id: 'phone-web',
      label: 'phone / web',
      reads: 21458,
      totalPageviews: 29938,
      subscriberAttentionTime: 3733,
      subscriberMedianAttention: '51 sec',
    },
    {
      id: 'phone-news-app',
      label: 'phone / news-app',
      reads: 12091,
      totalPageviews: 16246,
      subscriberAttentionTime: 16246,
      subscriberMedianAttention: '52 sec',
    },
    {
      id: 'phone-digi-paper',
      label: 'phone / Digi-paper',
      reads: 0,
      totalPageviews: 0,
      subscriberAttentionTime: 0,
      subscriberMedianAttention: '0 sec',
    },
    {
      id: 'tablet-web',
      label: 'tablet / web',
      reads: 1426,
      totalPageviews: 2156,
      subscriberAttentionTime: 463,
      subscriberMedianAttention: '51 sec',
    },
    {
      id: 'tablet-digi-paper',
      label: 'tablet / Digi-paper',
      reads: 0,
      totalPageviews: 0,
      subscriberAttentionTime: 0,
      subscriberMedianAttention: '0 sec',
    },
    {
      id: 'desktop-web',
      label: 'Desktop / web',
      reads: 13572,
      totalPageviews: 20785,
      subscriberAttentionTime: 8073,
      subscriberMedianAttention: '51 sec',
    },
    {
      id: 'desktop-digi-paper',
      label: 'Desktop / Digi-paper',
      reads: 0,
      totalPageviews: 0,
      subscriberAttentionTime: 0,
      subscriberMedianAttention: '0 sec',
    },
  ]);

  readonly filteredRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.rows();
    }

    return this.rows().filter((row) => row.label.toLowerCase().includes(term));
  });

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  trackRow(_index: number, row: DeviceRow): string {
    return row.id;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
