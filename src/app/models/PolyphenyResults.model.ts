import { PolyphenyResult } from './PolyphenyResult.model';

/**
 * Represents all results returned by Polypheny. All data is first converted to this format,
 * so that we can easier work with it in D3.
 */
export class PolyphenyResults {
    is_ordered: boolean;
    data: PolyphenyResult[];

    constructor(data: PolyphenyResult[], is_ordered: boolean) {
        this.data = data;
        this.is_ordered = is_ordered;
    }

    [Symbol.iterator](): Iterator<PolyphenyResult> {
        let index = 0;
        const data = this.data;

        return {
            next: (): IteratorResult<PolyphenyResult> => {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                } else {
                    return { done: true } as IteratorResult<PolyphenyResult>;
                }
            }
        };
    }
}
