import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, debounceTime, delay, distinctUntilChanged, EMPTY, iif, map, Observable, of, repeat, retry, Subscription, switchMap, tap, timeout } from 'rxjs';
import { GenerateRateQuotePayloadModel } from 'src/app/models';
import { ConversionService } from 'src/app/services';

@Component({
    selector: 'app-conversion',
    templateUrl: './conversion.component.html',
    styleUrls: ['./conversion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ConversionComponent implements OnInit, OnDestroy {
    private readonly DELAY: number = 500;
    trendDirectionUP: boolean = false;
    conversionForm: FormGroup;

    sentAmount$: Observable<number>;
    receivedAmount$: Observable<number>;
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    rate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    expired$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    subscription: Subscription = new Subscription();

    constructor(private _conversionService: ConversionService, private _formBuilder: FormBuilder) {
        this.conversionForm = this._formBuilder.group({
            sentAmount: [null, Validators.compose([Validators.required, Validators.min(0.01)])],
            receivedAmount: [null, Validators.compose([Validators.required, Validators.min(0.01)])]
        });

        this.sentAmount$ = this.conversionForm.controls['sentAmount'].valueChanges.pipe(map(x => +x));
        this.receivedAmount$ = this.conversionForm.controls['receivedAmount'].valueChanges.pipe(map(x => +x));
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.subscription.add(this.listenSentAmountChange().subscribe());
        this.subscription.add(this.listenReceivedAmountChange().subscribe());
    }

    private listenSentAmountChange() {
        return this.sentAmount$.pipe(
            distinctUntilChanged(),
            debounceTime(this.DELAY),
            switchMap(value => iif(() => this.conversionForm.controls['sentAmount'].valid, of(value), EMPTY)),
            tap(() => this.loading$.next(true)),
            tap(() => this.expired$.next(false)),
            switchMap(value => this._conversionService.convertSentValue(value)),
            tap((response: GenerateRateQuotePayloadModel) => this.updateRate(response.rate)),
            tap((response: GenerateRateQuotePayloadModel) => this.patchReceivedAmountWithoutEmit(response.receivedAmount)),
            tap(() => this.loading$.next(false)),
            switchMap((response: GenerateRateQuotePayloadModel) => this.addQuotationDelay(response)),
            tap(() => this.expired$.next(true)),
            tap(() => console.log('finalizou')),

        );
    }

    private listenReceivedAmountChange() {
        return this.receivedAmount$.pipe(
            distinctUntilChanged(),
            debounceTime(this.DELAY),
            switchMap(value => iif(() => this.conversionForm.controls['receivedAmount'].valid, of(value), EMPTY)),
            tap(() => this.expired$.next(false)),
            tap(() => this.loading$.next(true)),
            switchMap(value => this._conversionService.convertReceivedValue(value)),
            tap((response: GenerateRateQuotePayloadModel) => this.updateRate(response.rate)),
            tap((response: GenerateRateQuotePayloadModel) => this.patchSentAmountWithoutEmit(response.sentAmount)),
            tap(() => this.loading$.next(false)),
            switchMap((response: GenerateRateQuotePayloadModel) => this.addQuotationDelay(response)),
            tap(() => this.expired$.next(true)),
            tap(() => console.log('finalizou')),
        );
    }

    private addQuotationDelay(value: GenerateRateQuotePayloadModel): Observable<GenerateRateQuotePayloadModel> {
        const expirationDate = new Date(value.expiresAt);
        const currentMilliseconds = new Date().getTime();
        const expiration = expirationDate.getTime() - currentMilliseconds;
        return of(value).pipe(delay(10000))

    }

    private patchReceivedAmountWithoutEmit(sentAmount: string): void {
        this.conversionForm.patchValue({ receivedAmount: sentAmount }, { emitEvent: false })
    }

    private patchSentAmountWithoutEmit(receivedAmount: string): void {
        this.conversionForm.patchValue({ sentAmount: receivedAmount }, { emitEvent: false })
    }

    private updateRate(rate: string): void {
        this.trendDirectionUP = rate > this.rate$.value;
        this.rate$.next(rate);
    }
}

