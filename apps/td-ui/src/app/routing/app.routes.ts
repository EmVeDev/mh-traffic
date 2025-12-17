import {Routes} from '@angular/router';
import {HomeComponent} from '../features/home/home.component';
import {NotFoundPageComponent} from "../features/not-found-page/not-found-page.component";
/*
import { ToolAComponent } from '../features/tool-a/tool-a.component';
import { ToolBComponent } from '../features/tool-b/tool-b.component';
*/
export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [],
    pathMatch: 'full',
    loadComponent: () => import('../features/home/home.component').then((x) => x.HomeComponent),
  },
  {
    path: 'referrers',
    canActivate: [],
    loadComponent: () => import('../features/referrers/referrers.component').then((x) => x.ReferrersComponent),
  },

  /*{ path: 'tool-a', component: ToolAComponent },
  { path: 'tool-b', component: ToolBComponent },*/
  {
    path: '**',
    canActivate: [],
    component: NotFoundPageComponent,
  },
];
