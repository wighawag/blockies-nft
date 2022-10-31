// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.16;

import "solidity-kit/solc_0.8/ERC721/implementations/ERC721OwnedByAll.sol";
import "solidity-kit/solc_0.8/ERC721/ERC4494/implementations/UsingERC4494PermitWithDynamicChainId.sol";

contract Blockies is ERC721OwnedByAll, UsingERC4494PermitWithDynamicChainId {
	struct Seed {
		int32 s0;
		int32 s1;
		int32 s2;
		int32 s3;
	}

	bytes internal constant hexAlphabet = "0123456789abcdef";

	bytes internal constant TEMPLATE =
		"data:application/json,{\"name\":\"0x0000000000000000000000000000000000000000\",\"description\":\"A%20Blockie%20for%200x0000000000000000000000000000000000000000\",\"image\":\"data:image/svg+xml,<svg%20xmlns='http://www.w3.org/2000/svg'%20shape-rendering='crispEdges'%20width='512'%20height='512'><g%20transform='scale(64)'><path%20fill='hsl(000,000%,000%)'%20d='M0,0h8v8h-8z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/></g></svg>\"}";

	uint256 internal constant COLOR_BG_POS = 280 + 51;
	uint256 internal constant COLOR_1_POS = 334 + 51;
	uint256 internal constant COLOR_2_POS = 1179 + 51;

	uint256 internal constant PATH_1_POS = 352 + 51;
	uint256 internal constant PATH_2_POS = 1197 + 51;

	uint256 internal constant ADDRESS_NAME_POS = 72;
	uint256 internal constant ADDRESS_NAME_2_POS = 151;

	// address(0) works for non-upgradeable contract, where implementation is the contract, see solidity-kit
	constructor() UsingERC712WithDynamicChainId(address(0)) {}

	/// @notice A descriptive name for a collection of NFTs in this contract
	function name() public pure override returns (string memory) {
		return "Blockies";
	}

	/// @notice An abbreviated name for NFTs in this contract
	function symbol() external pure returns (string memory) {
		return "BLCK";
	}

	/// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
	/// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
	///  3986. The URI may point to a JSON file that conforms to the "ERC721
	///  Metadata JSON Schema".
	function tokenURI(uint256 id) external pure override returns (string memory str) {
		return _tokenURI(id);
	}

	/// @notice Query if a contract implements an interface
	/// @param id The interface identifier, as specified in ERC-165
	/// @dev Interface identification is specified in ERC-165. This function
	///  uses less than 30,000 gas.
	/// @return `true` if the contract implements `interfaceID` and
	///  `interfaceID` is not 0xffffffff, `false` otherwise
	function supportsInterface(bytes4 id) public view override(BasicERC721, UsingERC4494Permit) returns (bool) {
		return BasicERC721.supportsInterface(id) || UsingERC4494Permit.supportsInterface(id);
	}

	/// @notice emit Transfer event so that indexer can pick it up.
	///   This can be called by anyone at any time and does not change state
	///   As such itt keeps the token's operator-approval state and will reemit an Approval event to indicate that.
	/// @param id tokenID to emit the event for.
	function emitSelfTransferEvent(uint256 id) external {
		require(id < 2**160, "NONEXISTENT_TOKEN");
		(address owner, uint256 blockNumber, bool operatorEnabled) = _ownerBlockNumberAndOperatorEnabledOf(id);
		emit Transfer(owner, owner, id);

		if (operatorEnabled) {
			// we reemit the Approval as Transfer event indicate a reset, as per ERC721 spec
			emit Approval(owner, _operators[id], id);
		}
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
