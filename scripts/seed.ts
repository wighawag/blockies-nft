import {deployments, getNamedAccounts} from 'hardhat';

async function main() {
	const {execute} = deployments;
	const {deployer} = await getNamedAccounts();
	console.log({deployer});
	await execute('Blockies', {from: deployer, log: true}, 'registerIfNotAlready', deployer);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
