import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {network} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy, execute} = deployments;

	const {deployer, initialOwnerOfBlockyZero} = await getNamedAccounts();

	const Blockies = await deploy('Blockies', {
		from: deployer,
		log: true,
		args: [initialOwnerOfBlockyZero],
		// proxy: network.name !== 'mainnet',
		// "0x0200","0x0197","0x05","0x09","0x10","0x13","0x19","0x24","0x97","0x88","0x0167","0x0147","0x0179","0x0161","0x0139","0x65","0x0137"
		deterministicDeployment: '0x0137',
		autoMine: true,
		skipIfAlreadyDeployed: hre.network.live,
	});

	await execute('Blockies', {from: deployer, log: true}, 'emitSelfTransferEvent', Blockies.address);
};
export default func;
func.tags = ['Blockies', 'Blockies_deploy'];
