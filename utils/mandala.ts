import {Wallet} from 'ethers';
import {arrayify, solidityKeccak256} from 'ethers/lib/utils';

export async function randomMintSignature(to: string): Promise<{signature: string; tokenId: string}> {
	const randomWallet = Wallet.createRandom();
	const hashedData = solidityKeccak256(['string', 'address'], ['Mandala', to]);
	const signature = await randomWallet.signMessage(arrayify(hashedData));
	return {
		tokenId: randomWallet.address,
		signature
	};
}
