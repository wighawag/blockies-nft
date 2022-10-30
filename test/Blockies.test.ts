import {expect} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts} from 'hardhat';
import {setupUsers} from './utils/users';
import {Blockies} from '../typechain';

const setup = deployments.createFixture(async () => {
	await deployments.fixture('Blockies');
	const contracts = {
		Blockies: <Blockies>await ethers.getContract('Blockies')
	};
	const users = await setupUsers(await getUnnamedAccounts(), contracts);
	return {
		...contracts,
		users
	};
});

describe('Blockies', function () {
	it('works', async function () {
		const state = await setup();
		expect(state).to.be.not.null;
	});
});
