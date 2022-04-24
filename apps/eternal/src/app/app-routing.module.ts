import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserLoaderGuard } from './services/user-loader.guard';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [UserLoaderGuard],
        children: [
          {
            path: '',
            component: HomeComponent,
          },
          {
            path: 'security',
            loadChildren: () =>
              import('@eternal/user').then((m) => m.UserModule),
          },
          {
            path: 'customers',
            loadChildren: () =>
              import('@eternal/customers/feature').then(
                (m) => m.CustomersFeatureModule
              ),
          },
          {
            path: 'bookings',
            loadChildren: () =>
              import('@eternal/bookings').then((m) => m.BookingsModule),
          },
          {
            path: 'holidays',
            loadChildren: () =>
              import('@eternal/holidays/feature').then(
                (m) => m.HolidaysFeatureModule
              ),
          },
          {
            path: 'diary',
            loadChildren: () =>
              import('@eternal/diary/feature').then(
                (m) => m.DiaryFeatureModule
              ),
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
