import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

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
}
