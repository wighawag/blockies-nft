import {expect} from './chai-setup';
import {setup} from './setup';
import {BigNumber, utils} from 'ethers';
import {assert} from 'chai';
import {waitFor} from './utils';
const {getAddress} = utils;

describe('Blockies: non minted NFT', function () {
	it('tx ownerOf a non existing NFT (id >= 2**160) fails', async function () {
		const state = await setup();
		const {users} = state;
		await expect(users[0].Blockies.ownerOf(BigNumber.from('2').pow(160))).to.be.reverted;
	});

	it('tx ownerOf a non minted NFT do not fails if id < 2**160', async function () {
		const state = await setup();
		const {users} = state;
		await expect(users[0].Blockies.ownerOf(1000000000)).to.not.be.reverted;
	});

	it('call ownerOf a non existing NFT (id >= 2**160) fails', async function () {
		const state = await setup();
		const {Blockies} = state;
		await expect(Blockies.callStatic.ownerOf(BigNumber.from('2').pow(160))).to.be.reverted;
	});

	it('call ownerOf a non existing NFT fails', async function () {
		const state = await setup();
		const {Blockies} = state;
		const tokenID = 1000000000;
		const owner = getAddress('0x' + tokenID.toString(16).padStart(40, '0'));
		expect(await Blockies.callStatic.ownerOf(tokenID)).to.be.equal(owner);
	});

	it('tx getApproved a non existing NFT (id >= 2**160) fails', async function () {
		const state = await setup();
		const {users} = state;
		await expect(users[0].Blockies.getApproved(BigNumber.from('2').pow(160))).to.be.reverted;
	});

	it('call getApproved a non existing NFT (id >= 2**160) fails', async function () {
		const state = await setup();
		const {Blockies} = state;
		await expect(Blockies.callStatic.getApproved(BigNumber.from('2').pow(160))).to.be.reverted;
	});

	it('tx getApproved a non minted NFT do not fails if id < 2**160', async function () {
		const state = await setup();
		const {users} = state;
		const tokenID = 1000000000;
		await expect(users[0].Blockies.getApproved(tokenID)).to.not.be.reverted;
	});

	it('call getApproved a non minted NFT do not fails if id < 2**160', async function () {
		const state = await setup();
		const {Blockies} = state;
		const tokenID = 1000000000;
		expect(await Blockies.callStatic.getApproved(tokenID)).to.be.equal(
			'0x0000000000000000000000000000000000000000'
		);
	});
});

describe('Blockies: balance', function () {
	it('balance is one for new user', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		const balance = await Blockies.callStatic.balanceOf(users[0].address);
		assert.equal(balance.toNumber(), 1);
	});

	it('balance return correct value', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		const balance = await Blockies.callStatic.balanceOf(users[0].address);
		assert.equal(balance.toNumber(), 1);

		const tokenId1 = users[1].address;
		await waitFor(users[0].Blockies.registerIfNotAlready(tokenId1));
		const tokenId2 = users[2].address;
		await waitFor(users[0].Blockies.registerIfNotAlready(tokenId2));

		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[0].address, tokenId1));
		let newBalance = await Blockies.callStatic.balanceOf(users[0].address);
		assert.equal(newBalance.toNumber(), 2);
		await waitFor(users[2].Blockies.transferFrom(users[2].address, users[0].address, tokenId2));
		newBalance = await Blockies.callStatic.balanceOf(users[0].address);
		assert.equal(newBalance.toNumber(), 3);

		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[2].address, tokenId1));
		newBalance = await Blockies.callStatic.balanceOf(users[0].address);
		assert.equal(newBalance.toNumber(), 2);
	});
});
