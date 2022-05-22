import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenerateRateQuoteModel, GenerateRateQuotePayloadModel } from '../models';

@Injectable()
export class ConversionService {

    constructor(private _httpClient: HttpClient) { }

    convertSentValue = (value: number): Observable<GenerateRateQuotePayloadModel> => {
        let payload = new GenerateRateQuoteModel(value, null);
        return this._httpClient.post<GenerateRateQuotePayloadModel>(`${environment.apiUrl}generate-rate-quote`, payload)
    }

    convertReceivedValue = (value: number): Observable<GenerateRateQuotePayloadModel> => {
        let payload = new GenerateRateQuoteModel(null, value);
        return this._httpClient.post<GenerateRateQuotePayloadModel>(`${environment.apiUrl}generate-rate-quote`, payload)
    }
}
