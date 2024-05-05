import { fork, ChildProcess } from 'child_process';
import type { ChunkItemPrice } from './chunk-item-price.d.ts';

const roundRobin = <T>(array: T[], index = 0) => {
	return function (): T {
		if (index >= array.length) index = 0;
		return array[index++];
	};
};

const initializeCluster = ({
	backgroundTask,
	clusterSize,
	onMessage,
}: {
	backgroundTask: string;
	clusterSize: number;
	onMessage: (message: ChunkItemPrice) => void;
}) => {
	const processes = new Map<number, ChildProcess>();

	for (let index = 0; index < clusterSize; index++) {
		const child: ChildProcess = fork(backgroundTask);

		child.on('exit', () => {
			processes.delete(child.pid!);
		});

		child.on('error', (error) => {
			console.error(error);
			process.exit(1);
		});

		child.on('message', (message: ChunkItemPrice) => {
			onMessage(message);
		});

		processes.set(child.pid!, child);
	}

	console.log(processes.size);

	return {
		getProcess: roundRobin([...processes.values()]),
		killAll: () => {
			processes.forEach((child) => child.kill());
		},
	};
};

export const initialize = ({
	backgroundTask,
	clusterSize,
	onMessage,
}: {
	backgroundTask: string;
	clusterSize: number;
	onMessage: (message: ChunkItemPrice) => void;
}) => {
	const { getProcess, killAll } = initializeCluster({
		backgroundTask,
		clusterSize,
		onMessage,
	});

	function sendToChild(chunkItemPrice: ChunkItemPrice): void {
		const child = getProcess();
		child.send(chunkItemPrice);
	}

	return {
		sendToChild: sendToChild.bind(this),
		killAll: killAll.bind(this),
	};
};
