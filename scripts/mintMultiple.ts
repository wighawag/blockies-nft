import {deployments, getNamedAccounts} from 'hardhat';

async function main() {
	const args = process.argv.slice(2);
	const addresses = args[0].split(',');
	const {execute} = deployments;
	const {deployer} = await getNamedAccounts();
	await execute('Blockies', {from: deployer, log: true}, 'emitMultipleSelfTransferEvents', addresses);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
