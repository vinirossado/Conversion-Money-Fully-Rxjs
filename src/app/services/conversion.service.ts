import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConversionEnum, GenerateRateQuoteModel, GenerateRateQuotePayloadModel } from '../models';
import { QuotaModel } from '../models/quota.model';

@Injectable()
export class ConversionService {

    constructor(private _httpClient: HttpClient) { }

    convertSentValue(value: number): Observable<QuotaModel> {
        let payload = new GenerateRateQuoteModel(value, null);
        return this._httpClient.post<GenerateRateQuotePayloadModel>(`${environment.apiUrl}generate-rate-quote`, payload)
            .pipe(map(response => new QuotaModel(ConversionEnum.send, response)),
        );
    }

    convertReceivedValue(value: number): Observable<QuotaModel> {
        let payload = new GenerateRateQuoteModel(null, value);
        return this._httpClient.post<GenerateRateQuotePayloadModel>(`${environment.apiUrl}generate-rate-quote`, payload)
            .pipe(map(response => new QuotaModel(ConversionEnum.receive, response)),
        );
    }
}
