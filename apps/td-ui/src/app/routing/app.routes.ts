import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../pages/home/home.component').then((x) => x.HomeComponent),
  },
  {
    path: 'content/tags',
    loadComponent: () =>
      import(
        '../pages/reports/tags-report-page/tags-report-page.component'
      ).then((x) => x.TagsReportPageComponent),
  },
  {
    path: 'content/tags/:slug',
    loadComponent: () =>
      import('../pages/reports/tag-detail-page/tag-detail-page.component').then(
        (x) => x.TagDetailPageComponent
      ),
  },
  {
    path: 'content/sections',
    loadComponent: () =>
      import(
        '../pages/reports/sections-report-page/sections-report-page.component'
      ).then((x) => x.SectionsReportPageComponent),
  },
  {
    path: 'content/sections/:slug',
    loadComponent: () =>
      import(
        '../pages/reports/section-detail-page/section-detail-page.component'
      ).then((x) => x.SectionDetailPageComponent),
  },
  {
    path: 'referrers',
    loadComponent: () =>
      import(
        '../pages/reports/referrers-report-page/referrers-report-page.component'
      ).then((x) => x.ReferrersReportPageComponent),
  },
  {
    path: 'audiences',
    loadComponent: () =>
      import(
        '../pages/reports/audiences-report-page/audiences-report-page.component'
      ).then((x) => x.AudiencesReportPageComponent),
  },
  {
    path: '_blank',
    loadComponent: () =>
      import('../pages/extension-blank/extension-blank.component').then(
        (x) => x.BlankPageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../pages/not-found-page/not-found-page.component').then(
        (x) => x.NotFoundPageComponent
      ),
  },
];
