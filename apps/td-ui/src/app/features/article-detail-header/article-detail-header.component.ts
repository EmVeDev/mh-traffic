import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface MetaChip {
  label: string;
  tone: 'section' | 'type' | 'channel';
}

@Component({
  selector: 'td-article-detail-header',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-detail-header.component.html',
  styleUrl: './article-detail-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailHeaderComponent {
  readonly imageUrl = input<string>('');
  readonly title = input.required<string>();
  readonly articleUrl = input<string>('');
  readonly author = input.required<string>();
  readonly section = input.required<string>();
  readonly articleType = input.required<string>();
  readonly channel = input.required<string>();
  readonly tags = input<string[]>([]);
  readonly siteBadge = input<string>('N+');

  readonly metaChips = computed<MetaChip[]>(() => [
    { label: this.section(), tone: 'section' },
    { label: this.articleType(), tone: 'type' },
    { label: this.channel(), tone: 'channel' },
  ]);

  readonly tagsLabel = computed(() => this.tags().join(', '));

  trackChip(_index: number, chip: MetaChip): string {
    return `${chip.tone}-${chip.label}`;
  }

  trackTag(_index: number, tag: string): string {
    return tag;
  }
}
