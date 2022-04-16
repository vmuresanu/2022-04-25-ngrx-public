import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '@eternal/customers/model';

export interface CustomerWithSelected extends Customer {
  selected: boolean;
}
export interface CustomersViewModel {
  customers: CustomerWithSelected[];
  pageIndex: number;
  length: number;
}

@Component({
  selector: 'eternal-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnChanges {
  @Input() viewModel: CustomersViewModel | undefined;
  @Output() setSelected = new EventEmitter<number>();
  @Output() setUnselected = new EventEmitter<number>();
  @Output() switchPage = new EventEmitter<number>();

  displayedColumns = ['name', 'country', 'birthdate', 'action'];
  dataSource = new MatTableDataSource<CustomerWithSelected>([]);

  ngOnChanges(): void {
    if (this.viewModel) {
      this.dataSource.data = this.viewModel.customers;
    }
  }

  toggleSelection(toggleChange: MatSlideToggleChange, id: number) {
    if (toggleChange.checked) {
      this.setSelected.emit(id);
    } else {
      this.setUnselected.emit(id);
    }
  }
}
