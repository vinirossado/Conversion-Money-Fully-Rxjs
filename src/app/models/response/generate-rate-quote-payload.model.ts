export class GenerateRateQuotePayloadModel {

    //#region Properties

    expiresAt: string = '';
    rate: string = '';
    receivedAmount: string = '';
    sentAmount: string = '';

    //#endregion


    //#region Constructor

    constructor(expiresAt: string, rate: string, receivedAmount: string, sentAmount: string) {
        this.expiresAt = expiresAt;
        this.rate = rate;
        this.receivedAmount = receivedAmount;
        this.sentAmount = sentAmount;
    }

    //#endregion
}
