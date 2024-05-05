import axios from 'axios';
import { PriceItem } from '../price-item';
import { PriceApiResponse } from './price-api-response';

const PRICE_API_URL = 'https://prices.azure.com/api/retail/prices';

export async function* getPriceItems({
	url,
	currencyCode = 'BRL',
}: {
	url?: string | null;
	currencyCode?: string;
} = {}): AsyncGenerator<PriceItem[]> {
	if (!url) {
		//const filter = `$filter=serviceName eq 'Virtual Machines Licenses'`;
		//url = PRICE_API_URL + `?currencyCode=${currencyCode}&${filter}`;
		url = PRICE_API_URL + `?currencyCode=${currencyCode}`;
	}

	const response = await requestPriceItems(url);

	const nextPageLink = response.NextPageLink;

	if (!nextPageLink) {
		yield response.Items;
		return [];
	}

	yield response.Items;

	yield* getPriceItems({ url: nextPageLink });
}

const requestPriceItems = async (url: string): Promise<PriceApiResponse> => {
	const response = await axios.get<PriceApiResponse>(url);
	return response.data;
};
