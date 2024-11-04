export interface Visualization {
    apply(): void;
    getValueForAttribute(attr: string): string | number;
}
