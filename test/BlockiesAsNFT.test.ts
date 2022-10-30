import {setup} from './setup';
import {erc721} from 'ethereum-contracts-test-suite';
import {getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {network, ethers} from 'hardhat';
import {Wallet} from 'ethers';
import {parseEther} from 'ethers/lib/utils';

erc721.runMochaTests('Blockies as NFT', {burn: false}, async () => {
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

			const tx = await state.Blockies.connect(randomOwner).transferFrom(randomOwner.address, to, id);
			return {
				hash: tx.hash,
				tokenId: id
			};
		},
		users
	};
});
