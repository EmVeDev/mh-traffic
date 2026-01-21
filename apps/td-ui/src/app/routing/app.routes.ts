import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../features/home/home.component').then((x) => x.HomeComponent),
  },
  {
    path: 'content/:childRoute',
    loadComponent: () =>
      import('../features/content/content.component').then(
        (x) => x.ContentComponent
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
