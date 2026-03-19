import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'td-article-section-placeholder',
  standalone: true,
  templateUrl: './article-section-placeholder.component.html',
  styleUrl: './article-section-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSectionPlaceholderComponent {
  readonly title = input.required<string>();
  readonly height = input<number>(220);
}
