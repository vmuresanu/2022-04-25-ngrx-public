import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CustomersRepository } from '@eternal/customers/data';

@Injectable({
  providedIn: 'root',
})
export class DataGuard implements CanActivate {
  constructor(private customersRepository: CustomersRepository) {}

  canActivate(): boolean {
    this.customersRepository.load(1);
    return true;
  }
}
