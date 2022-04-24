import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {
  LoaderComponentModule,
  MessageModule,
} from '@eternal/shared/ui-messaging';
import { AppComponent } from './app.component';
import { HeaderComponentModule } from './header/header.component';
import { SidemenuComponentModule } from './sidemenu/sidemenu.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MatToolbarModule,
    HeaderComponentModule,
    MatSidenavModule,
    SidemenuComponentModule,
    LoaderComponentModule,
    RouterModule,
    MessageModule,
  ],
  exports: [AppComponent],
})
export class AppComponentModule {}
