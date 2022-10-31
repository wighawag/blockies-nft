import {ethers, deployments, getUnnamedAccounts} from 'hardhat';
import {setupUsers} from '../utils/users';
import {Blockies} from '../../typechain';
import {ERC4494SignerFactory} from '../utils/eip712-signers';

export const CommitmentHashZero = '0x000000000000000000000000000000000000000000000000';

export const setup = deployments.createFixture(async () => {
	await deployments.fixture('Blockies');
	const contracts = {
		Blockies: <Blockies>await ethers.getContract('Blockies')
	};
	const BlockiesPermit = await ERC4494SignerFactory.createSignerFactory(contracts.Blockies);

	const users = await setupUsers(await getUnnamedAccounts(), contracts, {BlockiesPermit});

	return {
		...contracts,
		users
	};
});

export type Setup = Awaited<ReturnType<typeof setup>>;
