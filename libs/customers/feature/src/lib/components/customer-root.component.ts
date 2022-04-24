import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomersRepository } from '@eternal/customers/data';
import { MessageService } from '@eternal/shared/ui-messaging';
import { first } from 'rxjs';

@Component({
  template: `<router-outlet></router-outlet>`,
})
export class CustomerRootComponent {
  constructor(
    customersRepository: CustomersRepository,
    router: Router,
    messageService: MessageService
  ) {
    customersRepository.hasError$.pipe(first(Boolean)).subscribe(() => {
      router.navigateByUrl('/');
      messageService.confirm(
        'Sorry, but Customers are not available at the moment.<br>Please try again later.'
      );
    });
  }
}

@NgModule({
  declarations: [CustomerRootComponent],
  exports: [CustomerRootComponent],
  imports: [RouterModule],
})
export class CustomerRootComponentModule {}
