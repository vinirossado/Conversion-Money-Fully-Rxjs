import { Optional } from "@angular/core";

export class GenerateRateQuoteModel {
    sentAmount: null | number;
    receivedAmount: null | number;

    constructor(sentAmount: number | null, receivedAmount: number | null) {
        this.sentAmount = sentAmount;
        this.receivedAmount = receivedAmount;
    }

}
