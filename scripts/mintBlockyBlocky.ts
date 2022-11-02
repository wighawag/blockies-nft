import {deployments, getNamedAccounts} from 'hardhat';

async function main() {
	const {execute} = deployments;
	const Blockies = await deployments.get('Blockies');
	const {deployer} = await getNamedAccounts();
	await execute('Blockies', {from: deployer, log: true}, 'emitSelfTransferEvent', Blockies.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
