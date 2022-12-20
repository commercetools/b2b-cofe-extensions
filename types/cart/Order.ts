import { Cart } from './Cart';
import { LineItemReturnItemDraft } from './LineItem';

export interface ReturnInfoItem extends LineItemReturnItemDraft {
  createdAt?: string;
  returnInfoId: string;
}

export interface ReturnInfo {
  items: ReturnInfoItem[];
  returnDate?: string;
  returnTrackingId?: string;
}

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderState?: string;
  createdAt?: string;
  returnInfo?: ReturnInfo[];
}
