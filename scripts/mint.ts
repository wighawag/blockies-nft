import {deployments, getNamedAccounts} from 'hardhat';
import {randomMintSignature} from '../utils/mandala';

async function main() {
	const {execute, read} = deployments;
	const currentPrice = await read('MandalaToken', 'currentPrice');
	const {deployer} = await getNamedAccounts();
	const {signature, tokenId} = await randomMintSignature(deployer);
	console.log({tokenId});
	await execute('MandalaToken', {from: deployer, log: true, value: currentPrice}, 'mint', deployer, signature);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
