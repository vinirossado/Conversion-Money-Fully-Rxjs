export class TrendingModel {
    value!: string;
    trending!: boolean;

    constructor(value: string, trending: boolean) {
        this.value = value;
        this.trending = trending;
    }
}
