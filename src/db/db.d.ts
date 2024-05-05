import pg from 'pg';
import { PriceItem } from '../price-item';

export type Db = {
	client: pg.Client;
	price: {
		createTableAsync: () => Promise<void>;
		insertAsync: (priceItem: PriceItem) => Promise<void>;
		countAsync: () => Promise<number>;
		deleteAllAsync: () => Promise<void>;
		disconnectAsync: () => Promise<void>;
	};
};
