import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'eternal-diaries',
  templateUrl: './diaries.component.html',
  styleUrls: ['./diaries.component.scss'],
})
export class DiariesComponent {}

@NgModule({
  declarations: [DiariesComponent],
  exports: [DiariesComponent],
})
export class DiariesComponentModule {}
