import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ConversionModule } from './conversion/conversion.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyMaskConfig, CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "€ ",
    suffix: "",
    thousands: ".",
    nullable: true,
    min: 0.01,
    inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        ConversionModule,
        HttpClientModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)

    ],
    providers: [],
    exports:[],
    bootstrap: [AppComponent],
})
export class AppModule { }
