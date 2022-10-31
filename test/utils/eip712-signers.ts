import {EIP712SignerFactory} from './eip712';

export const ERC4494SignerFactory = new EIP712SignerFactory({
	Permit: [
		{
			name: 'spender',
			type: 'address'
		},
		{
			name: 'tokenId',
			type: 'uint256'
		},
		{
			name: 'nonce',
			type: 'uint256'
		},
		{
			name: 'deadline',
			type: 'uint256'
		}
	]
});
