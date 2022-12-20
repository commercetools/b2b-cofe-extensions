export declare type WithError<T extends {}> = T & {
    error?: string;
    errorCode?: number;
};
