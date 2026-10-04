import { Routes } from '@angular/router';
import {CatalogComponent} from './catalog/catalog.component';

export const routes: Routes = [
  {
    path: 'csr',
    component: CatalogComponent
  },
  {
    path: 'ssr',
    component: CatalogComponent
  },
  {
    path: '',
    redirectTo: 'csr',
    pathMatch: 'full'
  }
];
