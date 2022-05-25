import { ConversionEnum } from "./conversion.enum";
import { GenerateRateQuotePayloadModel } from "./response/generate-rate-quote-payload.model";

export class QuotaModel {

    conversionSource: ConversionEnum;
    quota: GenerateRateQuotePayloadModel;

    constructor(conversionSource: ConversionEnum, quota: GenerateRateQuotePayloadModel) {
        this.conversionSource = conversionSource;
        this.quota = quota;
    }
}
