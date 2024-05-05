import cliProgress, { SingleBar } from 'cli-progress';

import { setTimeout } from 'node:timers/promises';
import { initialize } from './cluster.ts';
import { getDb } from './db/pg-connection.ts';
import { getPriceItems } from './azure-api/price-api.ts';
import { ChunkItemPrice } from './chunk-item-price';

import dotenv from 'dotenv';

dotenv.config();

const CLUSTER_SIZE = 50;
console.log('Working with cluster size: ', CLUSTER_SIZE);

const TASK_FILE = new URL('./background-task.ts', import.meta.url).pathname;
console.log('Working with task: ', TASK_FILE);
console.log('Running...');

const multibar = new cliProgress.MultiBar(
	{
		clearOnComplete: false,
		hideCursor: true,
		format: ' {bar} | {chunk} | {value}/{total}',
	},
	cliProgress.Presets.shades_classic,
);
const bars = new Map<string, SingleBar>();
const db = await getDb();

await db.price.createTableAsync();
await db.price.deleteAllAsync();
let total = 0;
let totalProcessed = 0;
const cp = initialize({
	backgroundTask: TASK_FILE,
	clusterSize: CLUSTER_SIZE,
	onMessage: async (chunkItemPrice: ChunkItemPrice) => {
		const bar = bars.get(chunkItemPrice.chunk);
		if (bar) {
			bar.increment();
			if (bar.getProgress() === bar.getTotal()) {
				bars.delete(chunkItemPrice.chunk);
			}
		}

		if (++totalProcessed !== total) return;

		console.log('\n');
		console.info('Total processed: ', await db.price.countAsync());

		multibar.stop();
		await db.price.disconnectAsync();
		cp.killAll();
		process.exit(0);
	},
});

console.log('Start cluster...');
await setTimeout(1000);

console.log('Start get items...');
let indexChunks = 0;

for await (const data of getPriceItems()) {
	indexChunks++;
	total += data.length;
	const chunkItemPrice: ChunkItemPrice = {
		chunk: `chunk-${indexChunks}`,
		items: data,
	};

	cp.sendToChild(chunkItemPrice);
	const bar = multibar.create(chunkItemPrice.items.length, 0, {
		chunk: chunkItemPrice.chunk,
	});
	bars.set(chunkItemPrice.chunk, bar);
	await setTimeout(1500);
}
