import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {network} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy, execute} = deployments;

	const {deployer, initialOwnerOfBlockyZero} = await getNamedAccounts();

	const Blockies = await deploy('Blockies', {
		from: deployer,
		log: true,
		args: [initialOwnerOfBlockyZero],
		deterministicDeployment: '0x65',
		autoMine: true,
		skipIfAlreadyDeployed: hre.network.live,
	});

	if (network.name === 'localhost') {
		await execute('Blockies', {from: deployer, log: true}, 'emitSelfTransferEvent', Blockies.address);
	}
};
export default func;
func.tags = ['Blockies', 'Blockies_deploy'];
