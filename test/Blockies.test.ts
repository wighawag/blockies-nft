import {BigNumber, constants} from 'ethers';
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

	it('keep operator approval after emitting first transfer event', async function () {
		const state = await setup();
		const {users, Blockies} = state;
		await waitFor(users[0].Blockies.approve(users[2].address, users[0].address));
		await waitFor(users[0].Blockies.emitSelfTransferEvent(users[0].address));
		expect(await Blockies.getApproved(users[0].address)).to.be.equal(users[2].address);
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

	it('return correct svg', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		expect(await Blockies.callStatic.tokenURI(users[0].address)).to.be.equal(
			`data:application/json,{\"name\":\"0x70997970c51812dc3a010c7d01b50e0d17dc79c8\",\"description\":\"Blocky%200x70997970c51812dc3a010c7d01b50e0d17dc79c8%20Generated%20On-Chain\",\"image\":\"data:image/svg+xml,<svg%20xmlns='http://www.w3.org/2000/svg'%20shape-rendering='crispEdges'%20width='512'%20height='512'><g%20transform='scale(64)'><path%20fill='hsl(037,094%,044%)'%20d='M0,0h8v8h-8z'/><path%20fill='hsl(034,084%,063%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm-8,1m1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1z'/><path%20fill='hsl(174,089%,035%)'%20d='M0,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v1h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v1h-1zm1,0h1v1h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/></g></svg>\"}`
		);
	});

	// it('fails to return svg for address(0)', async function () {
	// 	const state = await setup();
	// 	const {Blockies} = state;

	// 	await expect(Blockies.callStatic.tokenURI(constants.AddressZero)).to.be.reverted;
	// });

	it('blocky address(0) owned by initialOwnerOfBlockyZero', async function () {
		const state = await setup();
		const {Blockies, initialOwnerOfBlockyZero} = state;

		expect(await Blockies.callStatic.ownerOf(constants.AddressZero)).to.be.equal(initialOwnerOfBlockyZero.address);
	});

	it('synbol is BLOCKY', async function () {
		const state = await setup();
		const {Blockies} = state;

		expect(await Blockies.callStatic.symbol()).to.be.equal('BLOCKY');
	});

	it('ownerAndLastTransferBlockNumberList', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		const list = await Blockies.callStatic.ownerAndLastTransferBlockNumberList([
			users[1].address,
			users[2].address,
		]);
		expect(list[0].owner).to.be.equal(users[1].address);
		expect(list[0].lastTransferBlockNumber).to.be.equal(0);
		expect(list[1].owner).to.be.equal(users[2].address);
		expect(list[1].lastTransferBlockNumber).to.be.equal(0);
	});

	it('ownerAndLastTransferBlockNumberList after transfers', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[3].address, users[1].address));
		const list = await Blockies.callStatic.ownerAndLastTransferBlockNumberList([
			users[1].address,
			users[2].address,
		]);
		expect(list[0].owner).to.be.equal(users[3].address);
		expect(list[0].lastTransferBlockNumber).to.be.equal(5);
		expect(list[1].owner).to.be.equal(users[2].address);
		expect(list[1].lastTransferBlockNumber).to.be.equal(0);
	});

	it('totalSupply', async function () {
		const state = await setup();
		const {Blockies} = state;
		expect(await Blockies.totalSupply()).to.be.equal(BigNumber.from(2).pow(160));
	});

	it('totalSupply after transfers', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		await waitFor(users[1].Blockies.transferFrom(users[1].address, users[3].address, users[1].address));
		expect(await Blockies.totalSupply()).to.be.equal(BigNumber.from(2).pow(160));
	});

	it('claim ownership of zero fails', async function () {
		const state = await setup();
		const {users} = state;

		await expect(users[0].Blockies.claimOwnership(constants.AddressZero)).to.be.reverted;
	});

	it('claim ownership of zero Blockies fails', async function () {
		const state = await setup();
		const {users, Blockies} = state;

		await expect(users[0].Blockies.claimOwnership(Blockies.address)).to.be.reverted;
	});

	it('claim ownership of self fails', async function () {
		const state = await setup();
		const {users} = state;

		await expect(users[0].Blockies.claimOwnership(users[0].address)).to.be.reverted;
	});

	it('claim ownership by contract owner succeed', async function () {
		const state = await setup();
		const {users, initialOwnerOfBlockyZero, Blockies} = state;

		await waitFor(initialOwnerOfBlockyZero.Blockies.claimOwnership(Blockies.address));
		expect(await Blockies.callStatic.ownerOf(Blockies.address)).to.be.equal(initialOwnerOfBlockyZero.address);
	});

	it('owner can set ENS name', async function () {
		// const state = await setup();
		// const {initialOwnerOfBlockyZero} = state;
		// await waitFor(initialOwnerOfBlockyZero.Blockies.setENSName('hello.eth'));
		// TODO get name and check
		// see :
		// const label = sha3HexAddress(msg.sender);
		// const node = sha3(ADDR_REVERSE_NODE, label);
		// /**
		//  * @dev An optimised function to compute the sha3 of the lower-case
		//  *      hexadecimal representation of an Ethereum address.
		//  * @param addr The address to hash
		//  * @return The SHA3 hash of the lower-case hexadecimal encoding of the
		//  *         input address.
		//  */
		//  function sha3HexAddress(address addr) private returns (bytes32 ret) {
		// 		addr; ret; // Stop warning us about unused variables
		// 		assembly {
		// 				let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000
		// 				let i := 40
		// 		loop:
		// 				i := sub(i, 1)
		// 				mstore8(i, byte(and(addr, 0xf), lookup))
		// 				addr := div(addr, 0x10)
		// 				i := sub(i, 1)
		// 				mstore8(i, byte(and(addr, 0xf), lookup))
		// 				addr := div(addr, 0x10)
		// 				jumpi(loop, i)
		// 				ret := sha3(0, 40)
		// 		}
		// }
	});

	it('non owner cannot set ENS name', async function () {
		const state = await setup();
		const {users} = state;
		await expect(users[0].Blockies.setENSName('hello.eth')).to.be.revertedWith('NotAuthorized()');
	});

	it('owner can change owner', async function () {
		const state = await setup();
		const {initialOwnerOfBlockyZero, users, Blockies} = state;
		await waitFor(initialOwnerOfBlockyZero.Blockies.transferOwnership(users[0].address));
		expect(await Blockies.callStatic.owner()).to.be.equal(users[0].address);
	});

	it('now owner cannot change owner', async function () {
		const state = await setup();
		const {users} = state;
		await expect(users[0].Blockies.transferOwnership(users[1].address)).to.be.revertedWith('NotAuthorized()');
	});

	it('owner cannot change owner after having already changed it', async function () {
		const state = await setup();
		const {initialOwnerOfBlockyZero, users} = state;
		await initialOwnerOfBlockyZero.Blockies.transferOwnership(users[0].address);
		await expect(initialOwnerOfBlockyZero.Blockies.transferOwnership(users[1].address)).to.be.revertedWith(
			'NotAuthorized()'
		);
	});
});
