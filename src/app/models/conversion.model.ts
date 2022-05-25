import { ConversionEnum } from "./conversion.enum";

export class ConversionModel {
    value: number;
    type: ConversionEnum;

    constructor(value: number, type: ConversionEnum) {
        this.value = value;
        this.type = type;
    }
}
