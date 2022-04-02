import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SecurityService } from '@eternal/shared/security';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserLoaderGuard implements CanActivate {
  constructor(private securityService: SecurityService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.securityService.getLoaded$().pipe(
      map((loaded) => {
        if (!loaded) {
          this.securityService.load();
        }
        return loaded;
      }),
      filter((loaded) => loaded)
    );
  }
}
