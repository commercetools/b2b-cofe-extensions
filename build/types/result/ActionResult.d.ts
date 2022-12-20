export declare type ActionResult<T> = {
    statusCode: number;
    data?: T;
    error?: string;
};
