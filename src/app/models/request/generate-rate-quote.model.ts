export class GenerateRateQuoteModel {
    sentAmount: number = 0;
    receivedAmount: number = 0;

    constructor(sentAmount: number, receivedAmount: number) {
        this.sentAmount = sentAmount;
        this.receivedAmount = receivedAmount;
    }

}
