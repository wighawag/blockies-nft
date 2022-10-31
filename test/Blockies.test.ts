import {expect} from './chai-setup';
import {setup} from './setup';
import {waitFor} from './utils';

describe('Blockies', function () {
	it('has correct balance after emitting first transfer event', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[0].Blockies.emitFirstTransferEvent(users[0].address));
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
});
