import {setup} from './setup';
import {erc721} from 'ethereum-contracts-test-suite';
import {getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {network, ethers} from 'hardhat';
import {Wallet} from 'ethers';
import {parseEther} from 'ethers/lib/utils';

erc721.runMochaTests('Blockies as NFT', {burn: false, ownedByAll: true}, async () => {
	const {deployer} = await getNamedAccounts();
	const users = await getUnnamedAccounts();
	const state = await setup();
	return {
		contractAddress: state.Blockies.address,
		deployer,
		ethereum: network.provider,
		mint: async (to: string) => {
			const randomOwner = Wallet.createRandom().connect(ethers.provider);
			const id = randomOwner.address;
			const btx = await state.users[0].signer.sendTransaction({
				to: randomOwner.address,
				value: parseEther('0.1')
			});
			await btx.wait();

			const tx = await state.Blockies.connect(randomOwner).transferFrom(randomOwner.address, to, id, {
				gasLimit: 1000000 // needed for some reason for solidity-coverage, else you get `InvalidInputError: sender doesn't have enough funds to send tx. The max upfront cost is: 1649265979810500000000 and the sender's account only has: 100000000000000000` (See: https://github.com/sc-forks/solidity-coverage/issues/648)
			});
			return {
				hash: tx.hash,
				tokenId: id
			};
		},
		users
	};
});
