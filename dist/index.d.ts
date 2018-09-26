export declare type Hemidate = {
    year: number;
    month: number;
    day: number;
};
export declare function validate(d: Hemidate): void;
export declare function format(d: Hemidate): string;
export declare function fromDate(d: Date): Hemidate;
export declare function toDate(d: Hemidate): Date;
