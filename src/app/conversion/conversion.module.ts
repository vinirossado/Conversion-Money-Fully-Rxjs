import { NgModule } from '@angular/core';
import { ConversionService } from '../services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConversionComponent } from './conversion/conversion.component';

@NgModule({
  declarations: [
    ConversionComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ConversionService],
  exports: [ConversionComponent]

})
export class ConversionModule { }
