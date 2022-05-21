import { NgModule } from '@angular/core';
import { ConversionService } from '../services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversionComponent } from './conversion/conversion.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ConversionComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule ,
  ],
  providers: [ConversionService],
  exports: [ConversionComponent]

})
export class ConversionModule { }
