export declare enum FacetTypes {
    BOOLEAN = "boolean",
    TERM = "term",
    RANGE = "range"
}
export interface Facet {
    terms?: any[];
    type: FacetTypes.BOOLEAN | FacetTypes.TERM | FacetTypes.RANGE;
    identifier: string;
    label: string;
    key: string;
    selected?: boolean;
}
