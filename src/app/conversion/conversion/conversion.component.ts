import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
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
    sentAmount$: Observable<number>;
    receivedAmount$: Observable<number>;

    constructor(private _conversionService: ConversionService, private _formBuilder: FormBuilder) {
        this.conversionForm = this._formBuilder.group({
            sentAmount: [null, Validators.required],
            receivedAmount: [null, Validators.required]
        });

        this.sentAmount$ = this.conversionForm.controls['sentAmount'].valueChanges.pipe(map(x => +x));
        this.receivedAmount$ = this.conversionForm.controls['receivedAmount'].valueChanges.pipe(map(x => +x));
    }

    ngOnInit() {
        this.sentAmount$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(ret => {
            this.convertSentValue(ret)
        });

        this.receivedAmount$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(ret => {
            this.convertReceivedValue(ret)
        });
    }

    convertSentValue = (value: number) => {
        const obj = new GenerateRateQuoteModel(this.conversionForm.value.sentAmount, this.conversionForm.value.receivedAmount)
        this._conversionService
            .convertSentValue(value)
            .subscribe((quotationPayload: GenerateRateQuotePayloadModel) => {
                this.conversionForm.patchValue({ receivedAmount: quotationPayload.receivedAmount }, { emitEvent: false });
            });
    }

    convertReceivedValue = (value: number) => {
        const obj = new GenerateRateQuoteModel(this.conversionForm.value.sentAmount, this.conversionForm.value.receivedAmount)
        this._conversionService
            .convertReceivedValue(value)
            .subscribe((quotationPayload: GenerateRateQuotePayloadModel) => {
                this.conversionForm.patchValue({ sentAmount: quotationPayload.sentAmount }, { emitEvent: false })
            });
    }

}
