import {utils} from 'ethers';
import {ethers} from 'hardhat';

export async function computeNextContractAddress(contract: {address: string} | string): Promise<string> {
	const address = typeof contract === 'string' ? contract : contract.address;
	return utils.getContractAddress({from: address, nonce: await ethers.provider.getTransactionCount(address)});
}
