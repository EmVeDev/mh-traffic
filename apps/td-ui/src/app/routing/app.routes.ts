import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../features/home/home.component').then((x) => x.HomeComponent),
  },
  {
    path: 'referrers',
    loadComponent: () =>
      import('../features/referrers/referrers.component').then(
        (x) => x.ReferrersComponent
      ),
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('../features/tags/tags.component').then((x) =>
        x.TagsComponent
      ),
  },
  {
    path: '_blank',
    loadComponent: () =>
      import('../features/extension-blank/extension-blank.component').then(
        (x) => x.BlankPageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../features/not-found-page/not-found-page.component').then(
        (x) => x.NotFoundPageComponent
      ),
  },
];
