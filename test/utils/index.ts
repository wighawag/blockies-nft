import {TransactionReceipt, TransactionResponse} from '@ethersproject/abstract-provider';
import {ContractReceipt, ContractTransaction} from 'ethers';

export async function waitFor(p: Promise<ContractTransaction>): Promise<ContractReceipt>;
export async function waitFor(p: Promise<TransactionResponse>): Promise<TransactionReceipt> {
	const tx = await p;
	return tx.wait();
}
