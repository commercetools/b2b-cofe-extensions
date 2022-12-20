import { ShippingLocation } from './ShippingLocation';
import { Money } from '../product/Money';
export interface ShippingRate {
    shippingRateId?: string;
    name?: string;
    locations?: ShippingLocation[];
    price?: Money;
}
