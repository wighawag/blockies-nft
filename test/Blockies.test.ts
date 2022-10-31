import {expect} from './chai-setup';
import {setup} from './setup';
import {waitFor} from './utils';

describe('Blockies', function () {
	it('has correct balance from the start', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		expect(await Blockies.balanceOf(users[0].address)).to.be.equal(1);
	});

	it('has correct balance after emitting first transfer event', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[0].Blockies.emitSelfTransferEvent(users[0].address));
		expect(await Blockies.balanceOf(users[0].address)).to.be.equal(1);
	});

	it('has correct balance after sending self nft', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[0].address, users[1].address));
		expect(await Blockies.balanceOf(users[0].address)).to.be.equal(2);
		expect(await Blockies.balanceOf(users[1].address)).to.be.equal(0);
	});

	it('has correct balance after sending self nft and getting it back', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[0].address, users[1].address));
		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[1].address, users[1].address));
		expect(await Blockies.balanceOf(users[0].address), 'users[0]').to.be.equal(1);
		expect(await Blockies.balanceOf(users[1].address), 'users[1]').to.be.equal(1);
	});

	it('has correct balance after receiving 3 nft', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[0].address, users[1].address));
		await waitFor(users[2].Blockies.transferFrom(users[2].address, users[0].address, users[2].address));
		await waitFor(users[3].Blockies.transferFrom(users[3].address, users[0].address, users[3].address));
		expect(await Blockies.balanceOf(users[0].address), 'users[0]').to.be.equal(4);
	});

	it('has correct balance after receiving 3 nft and sending 4', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[0].address, users[1].address));
		await waitFor(users[2].Blockies.transferFrom(users[2].address, users[0].address, users[2].address));
		await waitFor(users[3].Blockies.transferFrom(users[3].address, users[0].address, users[3].address));
		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[1].address, users[1].address));
		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[2].address, users[2].address));
		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[3].address, users[3].address));
		await waitFor(users[0].Blockies.transferFrom(users[0].address, users[4].address, users[0].address));

		expect(await Blockies.balanceOf(users[0].address), 'users[0]').to.be.equal(0);
		expect(await Blockies.balanceOf(users[1].address), 'users[1]').to.be.equal(1);
		expect(await Blockies.balanceOf(users[2].address), 'users[2]').to.be.equal(1);
		expect(await Blockies.balanceOf(users[3].address), 'users[3]').to.be.equal(1);
		expect(await Blockies.balanceOf(users[4].address), 'users[4]').to.be.equal(2);
	});
});
