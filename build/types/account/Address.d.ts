export interface Address {
    addressId?: string;
    id?: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
    streetName?: string;
    streetNumber?: string;
    additionalStreetInfo?: string;
    additionalAddressInfo?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    state?: string;
    phone?: string;
    isDefaultBillingAddress?: boolean;
    isDefaultShippingAddress?: boolean;
}
