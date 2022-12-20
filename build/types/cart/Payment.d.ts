import { Money } from '../product/Money';
export declare enum PaymentStatuses {
    INIT = "init",
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export interface Payment {
    id: string;
    paymentProvider: string;
    paymentId: string;
    amountPlanned: Money;
    debug?: string;
    paymentStatus: string;
    version?: number;
    paymentMethod: string;
    paymentDetails?: [];
}
