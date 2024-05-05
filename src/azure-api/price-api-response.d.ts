import { PriceItem } from '../price-item';

export interface PriceApiResponse {
	BillingCurrency: string;
	CustomerEntityId: string;
	CustomerEntityType: string;
	Items: PriceItem[];
	NextPageLink?: string | null;
	Count: number;
}
