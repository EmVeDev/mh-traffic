import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import {
  MhdPillSelectComponent,
  MhdToolbarComponent,
} from '@mh-traffic/mh-design';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  templateUrl: './content.component.html',
  imports: [
    MhdToolbarComponent,
    MhdPillSelectComponent,
    MhdPillSelectComponent,
  ],
})
export class ContentComponent implements OnInit, OnDestroy {
  public activatedRoute = inject(ActivatedRoute);
  public childRouteSubscription?: Subscription;
  public activeChildRoute = signal<string>('all-content');
  private translocoService = inject(TranslocoService);
  public pageTitle = toSignal(
    this.translocoService.selectTranslate(
      'PAGE_TITLE',
      {},
      { scope: 'content' }
    ),
    { initialValue: '' }
  );
  private childRouteDefinitions = [
    { value: 'all-content', key: 'CHILD_ROUTES.ALL-CONTENT' },
    { value: 'tags', key: 'CHILD_ROUTES.TAGS' },
    { value: 'sections', key: 'CHILD_ROUTES.SECTIONS' },
    { value: 'authors', key: 'CHILD_ROUTES.AUTHORS' },
    { value: 'user-needs', key: 'CHILD_ROUTES.USER-NEEDS' },
    { value: 'genres', key: 'CHILD_ROUTES.GENRES' },
  ];

  public childRoutes = toSignal(
    combineLatest(
      this.childRouteDefinitions.map((route) =>
        this.translocoService
          .selectTranslate(route.key, undefined, {
            scope: 'content',
          })
          .pipe(
            map((translatedLabel) => ({
              value: route.value,
              label: translatedLabel,
            }))
          )
      )
    ),
    { initialValue: [] }
  );

  public siteOptions = [
    {
      value: 'nieuwsblad.be',
      label: 'nieuwsblad.be',
      iconUrl:
        'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.nieuwsblad.be',
    },
    {
      value: 'gva.be',
      label: 'gva.be',
      iconUrl:
        'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.gva.be',
    },
  ];

  public selectedSites = signal<string[]>(['nieuwsblad.be']);

  public ngOnInit() {
    this.childRouteSubscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.activeChildRoute.set(params['childRoute'] || 'all-content');
      }
    );
  }

  public ngOnDestroy() {
    this.childRouteSubscription?.unsubscribe();
  }
}
