import { ChunkItemPrice } from './chunk-item-price';
import { getDb } from './db/pg-connection.ts';

const db = await getDb();

process.on('message', async (chunk: ChunkItemPrice) => {
	if (!chunk.items.length) {
		console.log('Empty chunk...');
		if (process.send) process.send(chunk);
		return;
	}
	for (const item of chunk.items) {
		db.price
			.insertAsync(item)
			.then(() => {
				process.send && process.send(chunk);
			})
			.catch((error) => {
				console.error(error);
			});
	}
});
