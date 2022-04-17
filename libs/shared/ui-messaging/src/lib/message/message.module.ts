import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageComponent } from './message.component';
import { ConfirmationComponentModule } from './confirmation.component';

@NgModule({
  imports: [CommonModule, MatIconModule, ConfirmationComponentModule],
  declarations: [MessageComponent],
  exports: [MessageComponent],
})
export class MessageModule {}
