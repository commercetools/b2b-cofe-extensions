export declare enum FilterFieldTypes {
    BOOLEAN = "boolean",
    ENUM = "enum",
    TEXT = "text",
    NUMBER = "number"
}
export interface FilterFieldValue {
    value: string;
    name?: string;
}
export interface FilterField {
    field: string;
    type: string;
    translatable?: boolean;
    label?: string;
    values?: FilterFieldValue[];
}
