import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenerateRateQuoteModel, GenerateRateQuotePayloadModel } from 'src/app/models';
import { ConversionService } from 'src/app/services';

@Component({
    selector: 'app-conversion',
    templateUrl: './conversion.component.html',
    styleUrls: ['./conversion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ConversionComponent implements OnInit {

    conversionForm: FormGroup

    constructor(private _conversionService: ConversionService, private _formBuilder: FormBuilder) {
        this.conversionForm = this._formBuilder.group({
            sentAmount: [null, Validators.required],
            receivedAmount: [null, Validators.required]
        })

    }
    ngOnInit() {

    }
    convert = () => {
        const obj = new GenerateRateQuoteModel(this.conversionForm.value.sentAmount, this.conversionForm.value.receivedAmount)
        this._conversionService
            .convert(obj)
            .subscribe((quotationPayload: GenerateRateQuotePayloadModel) => {
                console.table(quotationPayload)
                this.conversionForm.patchValue(quotationPayload)
            }
            );

    }
}
