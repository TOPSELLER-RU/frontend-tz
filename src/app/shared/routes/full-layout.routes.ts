import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const FULL_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('app/page/page.module').then(m => m.PageModule)
  },
];
