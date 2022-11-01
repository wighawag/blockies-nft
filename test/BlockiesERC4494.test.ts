import {BigNumber, constants} from 'ethers';
import {expect} from './chai-setup';
import {setup} from './setup';
import {waitFor} from './utils';

describe('Blockies ERC4494', function () {
	it('permit for all update account nonce', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		const signature = await users[0].BlockiesPermitForAll.sign({
			owner: users[0].address,
			spender: users[1].address,
			nonce: 0,
			deadline: constants.MaxUint256
		});

		const permitTX = await users[1].Blockies.permitForAll(
			users[0].address,
			users[1].address,
			constants.MaxUint256,
			signature
		);
		await permitTX.wait();

		expect(await Blockies['nonces(address)'](users[0].address)).to.be.equal(1);
	});

	it('single permit update token nonce', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		const signature = await users[0].BlockiesPermit.sign({
			spender: users[1].address,
			tokenId: users[0].address,
			nonce: 0,
			deadline: constants.MaxUint256
		});

		const permitTX = await users[1].Blockies.permit(
			users[1].address,
			users[0].address,
			constants.MaxUint256,
			signature
		);
		await permitTX.wait();

		expect(await Blockies['nonces(uint256)'](users[0].address)).to.be.equal(4);
		expect(await Blockies.tokenNonces(users[0].address)).to.be.equal(4);
	});
});
