export const STATEMENT_INSERT_PRICE = `
	INSERT INTO price_items (
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
		armSkuName
) VALUES (
	$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
)`;

export const STATEMENT_CREATE_TABLE_PRICE = `
					CREATE TABLE IF NOT EXISTS price_items_temp (
						id UUID DEFAULT gen_random_uuid(),
						currencyCode VARCHAR,
						tierMinimumUnits INT,
						retailPrice DECIMAL,
						unitPrice DECIMAL,
						armRegionName VARCHAR DEFAULT '',
						location VARCHAR DEFAULT '',
						effectiveStartDate TIMESTAMP,
						meterId UUID,
						meterName VARCHAR,
						productId VARCHAR,
						skuId VARCHAR,
						productName VARCHAR,
						skuName VARCHAR,
						serviceName VARCHAR,
						serviceId VARCHAR,
						serviceFamily VARCHAR,
						unitOfMeasure VARCHAR,
						type VARCHAR,
						isPrimaryMeterRegion BOOLEAN,
						armSkuName VARCHAR,
						PRIMARY KEY (id)
					);
				`;

export const STATEMENT_COUNT_PRICE = 'SELECT COUNT(*) AS count FROM price_items;';

export const STATEMENT_DELETE_PRICE = 'DELETE FROM price_items;';
