import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    BehaviorSubject,
    Subject,
    debounceTime,
    filter,
    delay,
    merge,
    distinctUntilChanged,
    map,
    Observable,
    of,
    switchMap,
    tap,
    pairwise,
    Subscription,
    catchError,
    EMPTY,
    OperatorFunction,
} from 'rxjs';
import { ConversionStatus, ConversionModel, ConversionEnum } from 'src/app/models';
import { QuotaModel } from 'src/app/models/quota.model';
import { TrendingModel } from 'src/app/models/trending.model';
import { ConversionService } from 'src/app/services';

@Component({
    selector: 'app-conversion',
    templateUrl: './conversion.component.html',
    styleUrls: ['./conversion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ConversionComponent implements OnInit, OnDestroy {
    // Constants
    private static DELAY: number = 500;
    private static DELAY_BEFORE_REFRESH: number = 3000;

    // Public variables
    public conversionForm: FormGroup;

    // Observables
    private inputChanges$: BehaviorSubject<ConversionModel | null> = new BehaviorSubject<ConversionModel | null>(null);
    private state$: BehaviorSubject<ConversionStatus> = new BehaviorSubject<ConversionStatus>(ConversionStatus.idle);
    private refresh$: Subject<void> = new Subject<void>();
    private quota$: Subject<QuotaModel> = new Subject<QuotaModel>();

    appState$: Observable<ConversionStatus> = this.state$.asObservable();
    trending$: Observable<TrendingModel> =
        this.quota$.pipe(map(value => value.quota.rate),
            pairwise(),
            map(([previous, current]) => new TrendingModel(current, previous < current)));


    constructor(private _formBuilder: FormBuilder, private _conversionService: ConversionService) {

        this.conversionForm = this._formBuilder.group({
            sentAmount: [null, Validators.compose([Validators.required, Validators.min(0.01)])],
            receivedAmount: [null, Validators.compose([Validators.required, Validators.min(0.01)])],
        });

        const sentAmount: Observable<ConversionModel> = this.conversionForm.get('sentAmount')!.valueChanges.pipe(distinctUntilChanged(),
            map((value) => new ConversionModel(value, ConversionEnum.send)));

        const receivedAmount: Observable<ConversionModel> = this.conversionForm.get('receivedAmount')!.valueChanges.pipe(distinctUntilChanged(),
            map((value) => new ConversionModel(+value, ConversionEnum.send)),
        );

        merge(sentAmount, receivedAmount).subscribe(this.inputChanges$);
    }

    ngOnDestroy(): void {
        this.inputChanges$.complete();
        this.refresh$.complete();
        this.quota$.complete();
    }

    ngOnInit(): void {
        merge(this.inputChanges$, this.refresh$)
            .pipe(
                map(() => this.inputChanges$.value),
                filter((value) => !!value?.value),
                debounceTime(ConversionComponent.DELAY),
                tap(() => this.state$.next(ConversionStatus.loading)),
                switchMap((value) => this.fetchQuotaFromApi(value!)),
                catchError(() => this.handleError()),
                tap(() => this.state$.next(ConversionStatus.loaded)),
            )
            .subscribe(this.quota$);

        this.quota$
            .pipe(
                tap(() => this.state$.next(ConversionStatus.loaded)),
                tap((quota) => this.updateFormFields(quota)),
                switchMap((quota) => this.delayUntilExpires(quota)),
                tap(() => this.state$.next(ConversionStatus.expired)),
                delay(ConversionComponent.DELAY_BEFORE_REFRESH),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    private fetchQuotaFromApi(conversion: ConversionModel): Observable<QuotaModel> {
        switch (conversion.type) {
            case ConversionEnum.send:
                return this._conversionService.convertSentValue(conversion.value);
            case ConversionEnum.receive:
                return this._conversionService.convertReceivedValue(conversion.value);
        }
    }

    private updateFormFields(model: QuotaModel) {
        switch (model.conversionSource) {
            case ConversionEnum.send:
                return this.patchReceivedAmountWithoutEmit(model.quota.receivedAmount);
            case ConversionEnum.receive:
                return this.patchSentAmountWithoutEmit(model.quota.sentAmount);
        }
    }

    private delayUntilExpires(quota: QuotaModel): Observable<QuotaModel> {
        let expirationTime = new Date(quota.quota!.expiresAt).getTime();
        let currentTime = new Date().getTime();
        let expirationDelay = expirationTime - currentTime;
        return of(quota).pipe(delay(expirationDelay));
    }

    private patchReceivedAmountWithoutEmit(receivedAmount: string): void {
        this.conversionForm.patchValue({ receivedAmount: receivedAmount }, { emitEvent: false })
    }

    private patchSentAmountWithoutEmit(sentAmount: string): void {
        this.conversionForm.patchValue({ sentAmount: sentAmount }, { emitEvent: false })
    }

    public get states(): typeof ConversionStatus {
        return ConversionStatus;
    }

    private handleError(): Observable<QuotaModel> {
        this.state$.next(ConversionStatus.error);
        return EMPTY
    }
}
