import pg from 'pg';
import { PriceItem } from '../price-item';
import {
	STATEMENT_COUNT_PRICE,
	STATEMENT_CREATE_TABLE_PRICE,
	STATEMENT_DELETE_PRICE,
	STATEMENT_INSERT_PRICE,
} from './queries.ts';
import { Db } from './db';

export const getDb = async (): Promise<Db> => {
	const client = new pg.Client({
		user: 'admin',
		password: '123',
		host: 'localhost',
		port: 5432,
		database: 'comparador',
	});
	await client.connect();
	return {
		client,
		price: {
			createTableAsync: async (): Promise<void> => {
				await client.query(STATEMENT_CREATE_TABLE_PRICE);
			},
			insertAsync: async ({
				currencyCode,
				tierMinimumUnits,
				retailPrice,
				unitPrice,
				armRegionName,
				location,
				effectiveStartDate,
				meterId,
				meterName,
				productId,
				skuId,
				productName,
				skuName,
				serviceName,
				serviceId,
				serviceFamily,
				unitOfMeasure,
				type,
				isPrimaryMeterRegion,
				armSkuName,
			}: PriceItem): Promise<void> => {
				await client.query(STATEMENT_INSERT_PRICE, [
					currencyCode,
					tierMinimumUnits,
					retailPrice,
					unitPrice,
					armRegionName,
					location,
					effectiveStartDate,
					meterId,
					meterName,
					productId,
					skuId,
					productName,
					skuName,
					serviceName,
					serviceId,
					serviceFamily,
					unitOfMeasure,
					type,
					isPrimaryMeterRegion,
					armSkuName,
				]);
			},
			countAsync: async (): Promise<number> => {
				const { rows } = await client.query(STATEMENT_COUNT_PRICE);
				return rows[0].count;
			},
			deleteAllAsync: async (): Promise<void> => {
				await client.query(STATEMENT_DELETE_PRICE);
			},
			disconnectAsync: async () => await client.end(),
		},
	};
};
