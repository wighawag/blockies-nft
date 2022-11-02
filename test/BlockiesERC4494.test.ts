import {BigNumber, constants} from 'ethers';
import {expect} from './chai-setup';
import {setup} from './setup';
import {waitFor} from './utils';

describe('Blockies ERC4494', function () {
	it('supportsInterface', async function () {
		const state = await setup();
		const {Blockies} = state;
		expect(await Blockies.callStatic.supportsInterface('0x5604e225')).to.be.true;
		expect(await Blockies.callStatic.supportsInterface('0xefdb586b')).to.be.true;
	});

	it('permit for all update account nonce', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		const signature = await users[0].BlockiesPermitForAll.sign({
			owner: users[0].address,
			spender: users[1].address,
			nonce: 0,
			deadline: constants.MaxUint256,
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
			deadline: constants.MaxUint256,
		});

		const permitTX = await users[1].Blockies.permit(
			users[1].address,
			users[0].address,
			constants.MaxUint256,
			signature
		);
		await permitTX.wait();

		expect(await Blockies['nonces(uint256)'](users[0].address)).to.be.equal(1);
		expect(await Blockies.tokenNonces(users[0].address)).to.be.equal(1);
	});

	it('single permit update token nonce after transfer', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[3].address, users[0].address));

		const nonce = await Blockies.tokenNonces(users[0].address);

		const signature = await users[3].BlockiesPermit.sign({
			spender: users[1].address,
			tokenId: users[0].address,
			nonce,
			deadline: constants.MaxUint256,
		});

		const permitTX = await users[1].Blockies.permit(
			users[1].address,
			users[0].address,
			constants.MaxUint256,
			signature
		);
		await permitTX.wait();

		const newNonce = nonce.add(1);
		expect(await Blockies['nonces(uint256)'](users[0].address)).to.be.equal(newNonce);
		expect(await Blockies.tokenNonces(users[0].address)).to.be.equal(newNonce);
	});

	it('getting nonce of non existent token fails', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await expect(Blockies.tokenNonces(BigNumber.from(2).pow(160))).to.be.reverted;
	});

	it('getting nonce of existing token works', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		expect(await Blockies.tokenNonces(BigNumber.from(2).pow(160).sub(1))).to.be.equal(0);
	});
});
