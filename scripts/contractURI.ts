import {deployments} from 'hardhat';

async function main() {
	const {read} = deployments;
	const data = await read('Blockies', 'contractURI');
	console.log(data);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
