import { NgModule } from '@angular/core';
import { ConversionService } from '../services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversionComponent } from './conversion/conversion.component';
import { CommonModule } from '@angular/common';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    ConversionComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxCurrencyModule


  ],
  providers: [ConversionService],
  exports: [ConversionComponent]

})
export class ConversionModule { }
