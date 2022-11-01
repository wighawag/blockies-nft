import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {network} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy} = deployments;

	const {deployer, initialOwnerOfBlockyZero} = await getNamedAccounts();

	await deploy('Blockies', {
		from: deployer,
		log: true,
		args: [initialOwnerOfBlockyZero],
		// proxy: network.name !== 'mainnet',
		deterministicDeployment: true,
		autoMine: true,
		skipIfAlreadyDeployed: hre.network.live
	});
};
export default func;
func.tags = ['Blockies', 'Blockies_deploy'];
