import {expect} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts} from 'hardhat';
import {setupUsers} from './utils/users';
import {MandalaToken} from '../typechain';

const setup = deployments.createFixture(async () => {
	await deployments.fixture('MandalaToken');
	const contracts = {
		MandalaToken: <MandalaToken>await ethers.getContract('MandalaToken')
	};
	const users = await setupUsers(await getUnnamedAccounts(), contracts);
	return {
		...contracts,
		users
	};
});

describe('MandalaToken', function () {
	it('works', async function () {
		const state = await setup();
		expect(state).to.be.not.null;
	});
});
