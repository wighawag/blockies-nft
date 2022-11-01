// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";
import "solidity-kit/solc_0.8/ERC721/ERC4494/implementations/UsingERC4494PermitWithDynamicChainId.sol";
import "solidity-kit/solc_0.8/ERC173/interfaces/IERC173.sol";
import "./ERC721OwnedByAll.sol";

/// @notice Blockies as NFT. Each ethereum address owns its own one. No minting needed.
/// You can even use Permit (EIP-4494) to approve contracts via signatures.
/// Note though that unless you transfer or call `emitSelfTransferEvent` indexer would not know of your token.
/// @title On-chain Blockies
contract Blockies is ERC721OwnedByAll, UsingERC4494PermitWithDynamicChainId, IERC721Metadata {
	error AlreadyClaimed();

	// ------------------------------------------------------------------------------------------------------------------
	// TEMPLATE
	// ------------------------------------------------------------------------------------------------------------------
	bytes internal constant TEMPLATE =
		"data:application/json,{\"name\":\"0x0000000000000000000000000000000000000000\",\"description\":\"Blocky%200x0000000000000000000000000000000000000000%20generated%20on-chain\",\"image\":\"data:image/svg+xml,<svg%20xmlns='http://www.w3.org/2000/svg'%20shape-rendering='crispEdges'%20width='512'%20height='512'><g%20transform='scale(64)'><path%20fill='hsl(000,000%,000%)'%20d='M0,0h8v8h-8z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/></g></svg>\"}";

	// 33 start position for address in name
	// 41 = length of address - 1
	// 3 =  number of "\"
	uint256 internal constant ADDRESS_NAME_POS = 34 - 3 + 41; // 72

	// 22 = distance
	// 9 = Blocky%20
	// 41 = length of address - 1
	// 4 = further number of "\"
	uint256 internal constant ADDRESS_NAME_2_POS = ADDRESS_NAME_POS + 22 - 4 + 9 + 41; // 140

	// 184 = distance
	// 4 = further number of "\"
	// 23 = %20generated%20on-chain
	uint256 internal constant COLOR_BG_POS = ADDRESS_NAME_2_POS + 23 + 184 - 4; // 343

	// 54 = distance
	uint256 internal constant COLOR_1_POS = COLOR_BG_POS + 54; // 397
	// 18 = distance
	uint256 internal constant PATH_1_POS = COLOR_1_POS + 18; // 415

	// 827 = distance
	uint256 internal constant COLOR_2_POS = PATH_1_POS + 827; // 1242
	// 18 = distance
	uint256 internal constant PATH_2_POS = COLOR_2_POS + 18; // 1260

	// ------------------------------------------------------------------------------------------------------------------
	// DATA AND TYPES
	// ------------------------------------------------------------------------------------------------------------------
	bytes internal constant hexAlphabet = "0123456789abcdef";

	struct Seed {
		int32 s0;
		int32 s1;
		int32 s2;
		int32 s3;
	}

	/// @notice owner of the contract, can claim this contract's blocky
	/// no other role granted
	address public immutable owner;

	// ------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTOR
	// ------------------------------------------------------------------------------------------------------------------

	constructor(address contractOwner) UsingERC712WithDynamicChainId(address(0)) ERC721OwnedByAll(contractOwner) {
		owner = contractOwner;
	}

	// ------------------------------------------------------------------------------------------------------------------
	// EXTERNAL INTERFACE
	// ------------------------------------------------------------------------------------------------------------------

	/// @inheritdoc IERC721Metadata
	function name() public pure override(IERC721Metadata, Named) returns (string memory) {
		return "On-chain Blockies";
	}

	/// @inheritdoc IERC721Metadata
	function symbol() external pure returns (string memory) {
		return "BLOCKY";
	}

	/// @inheritdoc IERC721Metadata
	function tokenURI(uint256 id) external pure override returns (string memory str) {
		return _tokenURI(id);
	}

	/// @inheritdoc IERC165
	function supportsInterface(bytes4 id)
		public
		view
		override(BasicERC721, UsingERC4494Permit, IERC165)
		returns (bool)
	{
		return BasicERC721.supportsInterface(id) || UsingERC4494Permit.supportsInterface(id);
	}

	/// @notice emit Transfer event so that indexer can pick it up.
	///   This can be called by anyone at any time and does not change state
	///   As such it keeps the token's operator-approval state and will re-emit an Approval event to indicate that.
	/// @param id tokenID to emit the event for.
	function emitSelfTransferEvent(uint256 id) external {
		(address currentowner, , bool operatorEnabled) = _ownerNonceAndOperatorEnabledOf(id);
		if (currentowner == address(0)) {
			revert NonExistentToken(id);
		}

		emit Transfer(currentowner, currentowner, id);

		if (operatorEnabled) {
			// we reemit the Approval as Transfer event indicate a reset, as per ERC721 spec
			emit Approval(currentowner, _operators[id], id);
		}
	}

	/// @notice claim ownership of the blocky if you are the owner of a contract
	/// @param id blocky address to claim
	function claimOwnership(uint256 id) external {
		(address currentowner, uint256 nonce) = _ownerAndNonceOf(id);
		if (currentowner == address(0)) {
			revert NonExistentToken(id);
		}

		bool registered = (nonce >> 24) != 0;
		if (registered) {
			revert AlreadyClaimed();
		}

		if (currentowner.code.length == 0 || IERC173(currentowner).owner() != msg.sender) {
			revert NotAuthorized();
		}

		_transferFrom(currentowner, msg.sender, id, false);
	}

	// ------------------------------------------------------------------------------------------------------------------
	// INTERNALS
	// ------------------------------------------------------------------------------------------------------------------

	function _writeUint(
		bytes memory data,
		uint256 endPos,
		uint256 num
	) internal pure {
		while (num != 0) {
			data[endPos--] = bytes1(uint8(48 + (num % 10)));
			num /= 10;
		}
	}

	function _seedrand(bytes memory seed) internal pure returns (Seed memory randseed) {
		unchecked {
			for (uint256 i = 0; i < seed.length; i++) {
				uint8 j = uint8(i % 4);
				if (j == 0) {
					randseed.s0 = (randseed.s0 << 5) - randseed.s0 + int32(uint32(uint8(seed[i])));
				} else if (j == 1) {
					randseed.s1 = (randseed.s1 << 5) - randseed.s1 + int32(uint32(uint8(seed[i])));
				} else if (j == 2) {
					randseed.s2 = (randseed.s2 << 5) - randseed.s2 + int32(uint32(uint8(seed[i])));
				} else if (j == 3) {
					randseed.s3 = (randseed.s3 << 5) - randseed.s3 + int32(uint32(uint8(seed[i])));
				}
			}
		}
	}

	function _rand(Seed memory randseed) internal pure returns (uint256 rnd) {
		unchecked {
			int32 t = randseed.s0 ^ int32(randseed.s0 << 11);
			randseed.s0 = randseed.s1;
			randseed.s1 = randseed.s2;
			randseed.s2 = randseed.s3;
			randseed.s3 = randseed.s3 ^ (randseed.s3 >> 19) ^ t ^ (t >> 8);
			rnd = uint32(randseed.s3);
		}
	}

	function _randhsl(Seed memory randseed)
		internal
		pure
		returns (
			uint16 hue,
			uint8 saturation,
			uint8 lightness
		)
	{
		unchecked {
			// saturation is the whole color spectrum
			hue = uint16(((_rand(randseed) * 360) / 2147483648));
			// saturation goes from 40 to 100, it avoids greyish colors
			saturation = uint8((_rand(randseed) * 60) / 2147483648 + 40);
			// lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
			lightness = uint8(
				((_rand(randseed) + _rand(randseed) + _rand(randseed) + _rand(randseed)) * 25) / 2147483648
			);
		}
	}

	function _setColor(
		bytes memory metadata,
		Seed memory randseed,
		uint8 i
	) internal pure {
		(uint16 hue, uint8 saturation, uint8 lightness) = _randhsl(randseed);
		uint256 pos = COLOR_BG_POS;
		if (i == 1) {
			pos = COLOR_1_POS;
		} else if (i == 2) {
			pos = COLOR_2_POS;
		}
		_writeUint(metadata, pos + 0, hue);
		_writeUint(metadata, pos + 4, saturation);
		_writeUint(metadata, pos + 9, lightness);
	}

	function _writeUintAsHex(
		bytes memory data,
		uint256 endPos,
		uint256 num
	) internal pure {
		while (num != 0) {
			data[endPos--] = bytes1(hexAlphabet[num % 16]);
			num /= 16;
		}
	}

	function _addressToString(address who) internal pure returns (string memory) {
		bytes memory addr = "0x0000000000000000000000000000000000000000";
		_writeUintAsHex(addr, 41, uint160(who));
		return string(addr);
	}

	function _setPixel(
		bytes memory metadata,
		uint256 x,
		uint256 y,
		uint8 color
	) internal pure {
		uint256 pathPos = 0;
		if (color == 0) {
			return;
		}
		if (color == 1) {
			pathPos = PATH_1_POS;
		} else if (color == 2) {
			pathPos = PATH_2_POS;
		}
		uint256 pos = pathPos + y * 5 + (y * 8 + x) * 12 + 8;
		metadata[pos] = "1";
	}

	function _tokenURI(uint256 id) internal pure returns (string memory) {
		bytes memory metadata = TEMPLATE;
		_writeUintAsHex(metadata, ADDRESS_NAME_POS, id);
		_writeUintAsHex(metadata, ADDRESS_NAME_2_POS, id);

		Seed memory randseed = _seedrand(bytes(_addressToString(address(uint160(id)))));

		_setColor(metadata, randseed, 1);
		_setColor(metadata, randseed, 0);
		_setColor(metadata, randseed, 2);

		for (uint256 y = 0; y < 8; y++) {
			uint8 p0 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p1 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p2 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p3 = uint8((_rand(randseed) * 23) / 2147483648 / 10);

			_setPixel(metadata, 0, y, p0);
			_setPixel(metadata, 1, y, p1);
			_setPixel(metadata, 2, y, p2);
			_setPixel(metadata, 3, y, p3);
			_setPixel(metadata, 4, y, p3);
			_setPixel(metadata, 5, y, p2);
			_setPixel(metadata, 6, y, p1);
			_setPixel(metadata, 7, y, p0);
		}

		return string(metadata);
	}
}
