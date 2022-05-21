import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, from, map, Observable, of, Subject, switchMap, tap, UnaryFunction } from 'rxjs';
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
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _conversionService: ConversionService, private _formBuilder: FormBuilder) {
        this.conversionForm = this._formBuilder.group({
            sentAmount: [null, Validators.compose([Validators.required, Validators.min(0)])],
            receivedAmount: [null, Validators.compose([Validators.required, Validators.min(0)])]
        });

        this.sentAmount$ = this.conversionForm.controls['sentAmount'].valueChanges.pipe(map(x => +x));
        this.receivedAmount$ = this.conversionForm.controls['receivedAmount'].valueChanges.pipe(map(x => +x));
    }

    ngOnInit() {
        this.listenSentAmountChange().subscribe()
        this.listenReceivedAmountChange().subscribe()
    }

    private listenSentAmountChange() {
        return this.sentAmount$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.loading$.next(true)),
            switchMap(value => this._conversionService.convertSentValue(value)),
            map((response: GenerateRateQuotePayloadModel) => response.sentAmount),
            tap((response: string) => this.patchRecievedAmountWithoutEmit(response)),
            tap(() => this.loading$.next(false)),
        );
    }

    private listenReceivedAmountChange() {
        return this.receivedAmount$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.loading$.next(true)),
            switchMap(value => this._conversionService.convertReceivedValue(value)),
            map((response: GenerateRateQuotePayloadModel) => response.receivedAmount),
            tap((response: string) => this.patchSentAmountWithoutEmit(response)),
            tap(() => this.loading$.next(false)),
        );
    }

    private patchRecievedAmountWithoutEmit(sentAmount: string) {
        this.conversionForm.patchValue({ receivedAmount: sentAmount }, { emitEvent: false })
    }

    private patchSentAmountWithoutEmit(receivedAmount: string) {
        this.conversionForm.patchValue({ sentAmount: receivedAmount }, { emitEvent: false })
    }
}

