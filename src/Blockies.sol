// SPDX-License-Identifier: WTFPL
pragma solidity 0.8.16;

import "solidity-kit/solc_0.8/ERC721/interfaces/IERC721Metadata.sol";
import "solidity-kit/solc_0.8/ERC173/interfaces/IERC173.sol";
import "solidity-kit/solc_0.8/ERC721/TokenURI/interfaces/IContractURI.sol";

import "solidity-kit/solc_0.8/ERC721/ERC4494/implementations/UsingERC4494PermitWithDynamicChainID.sol";
import "solidity-kit/solc_0.8/ERC173/implementations/Owned.sol";

import "./ERC721OwnedByAll.sol";

/// @notice What if Blockies were NFTs. That is what this collection is all about.
/// Check your wallet as every ethereum address already owns its own Blocky NFT. No minting needed.
/// You can even use Permit (EIP-4494) to approve transfers from smart contracts, via signatures.
/// Note that unless you transfer or call `emitSelfTransferEvent` first, indexers would not know of your token.
/// So if you want your Blocky to shows up, you can call `emitSelfTransferEvent(<your address>)`.
/// @title On-chain Blockies
contract Blockies is ERC721OwnedByAll, UsingERC4494PermitWithDynamicChainID, IERC721Metadata, IContractURI, Owned {
	/// @notice You attempted to claim a Blocky from an EIP-173 contract (using owner()) while the Blocky has already been claimed or transfered.
	error AlreadyClaimed();

	// ------------------------------------------------------------------------------------------------------------------
	// METADATA TEMPLATE
	// ------------------------------------------------------------------------------------------------------------------
	bytes internal constant TOKEN_URI_TEMPLATE =
		'data:application/json,{"name":"0x0000000000000000000000000000000000000000","description":"Blocky%200x0000000000000000000000000000000000000000%20Generated%20On-Chain","image":"';

	// 31 start position for name
	// 41 = length of address - 1
	uint256 internal constant ADDRESS_NAME_POS = 31 + 41; // 72

	// 90 = start position for descripton
	// 9 = Blocky%20
	// 41 = length of address - 1
	uint256 internal constant ADDRESS_NAME_2_POS = 90 + 9 + 41; // 140

	bytes internal constant SVG_TEMPLATE =
		"data:image/svg+xml,<svg%20xmlns='http://www.w3.org/2000/svg'%20shape-rendering='crispEdges'%20width='512'%20height='512'><g%20transform='scale(64)'><path%20fill='hsl(000,000%,000%)'%20d='M0,0h8v8h-8z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/><path%20fill='hsl(000,000%,000%)'%20d='M0,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm-8,1m1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1zm1,0h1v0h-1z'/></g></svg>";

	uint256 internal constant COLOR_BG_POS = 168;

	uint256 internal constant COLOR_1_POS = 222;
	uint256 internal constant PATH_1_POS = COLOR_1_POS + 18;

	uint256 internal constant COLOR_2_POS = 1067;
	uint256 internal constant PATH_2_POS = COLOR_2_POS + 18;

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

	// ------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTOR
	// ------------------------------------------------------------------------------------------------------------------

	constructor(address contractOwner)
		UsingERC712WithDynamicChainID(address(0))
		ERC721OwnedByAll(contractOwner)
		Owned(contractOwner, 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e) // ENS Registry
	{}

	// ------------------------------------------------------------------------------------------------------------------
	// EXTERNAL INTERFACE
	// ------------------------------------------------------------------------------------------------------------------

	/// @inheritdoc IERC721Metadata
	function name() public pure override(IERC721Metadata, Named) returns (string memory) {
		return "Blockies";
	}

	/// @inheritdoc IERC721Metadata
	function symbol() external pure returns (string memory) {
		return "BLOCKY";
	}

	/// @inheritdoc IERC721Metadata
	function tokenURI(uint256 tokenID) external pure override returns (string memory str) {
		bytes memory metadata = TOKEN_URI_TEMPLATE;
		_writeUintAsHex(metadata, ADDRESS_NAME_POS, tokenID);
		_writeUintAsHex(metadata, ADDRESS_NAME_2_POS, tokenID);

		return string(bytes.concat(metadata, _renderSVG(tokenID), '"}'));
	}

	/// @inheritdoc IContractURI
	function contractURI() external view returns (string memory) {
		return
			string(
				bytes.concat(
					'data:application/json,{"name":"On-chain%20Blockies","description":"The%20ubiquitous%20Blockies,%20but%20fully%20generated%20on-chain.%20Each%20Ethereum%20address%20owns%20its%20own%20unique%20Blocky%20NFT.","image":"',
					_renderSVG(uint160(address(this))),
					'"}'
				)
			);
	}

	/// @inheritdoc IERC165
	function supportsInterface(bytes4 interfaceID)
		public
		view
		override(BasicERC721, UsingERC4494Permit, IERC165)
		returns (bool)
	{
		return BasicERC721.supportsInterface(interfaceID) || UsingERC4494Permit.supportsInterface(interfaceID);
	}

	/// @notice emit a Transfer event where from == to so that indexers can scan the token.
	///   This can be called by anyone at any time and does not change state.
	///   As such it keeps the token's approval state and will re-emit an Approval event to indicate that if needed.
	/// @param tokenID token to emit the event for.
	function emitSelfTransferEvent(uint256 tokenID) external {
		(address currentowner, bool operatorEnabled) = _ownerAndOperatorEnabledOf(tokenID);
		if (currentowner == address(0)) {
			revert NonExistentToken(tokenID);
		}

		emit Transfer(currentowner, currentowner, tokenID);

		if (operatorEnabled) {
			// we reemit the Approval as Transfer event indicate a reset, as per ERC721 spec
			emit Approval(currentowner, _operators[tokenID], tokenID);
		}
	}

	/// @notice claim ownership of the blocky owned by a contract.
	///   Will only work  if you are the owner of that contract (EIP-173).
	/// @param tokenID blocky address to claim
	function claimOwnership(uint256 tokenID) external {
		(address currentowner, uint256 nonce) = _ownerAndNonceOf(tokenID);
		if (currentowner == address(0)) {
			revert NonExistentToken(tokenID);
		}

		bool registered = (nonce >> 24) != 0;
		if (registered) {
			revert AlreadyClaimed();
		}

		if (currentowner.code.length == 0 || IERC173(currentowner).owner() != msg.sender) {
			revert NotAuthorized();
		}

		_transferFrom(currentowner, msg.sender, tokenID, false);
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

	function _renderSVG(uint256 tokenID) internal pure returns (bytes memory) {
		bytes memory svg = SVG_TEMPLATE;

		Seed memory randseed = _seedrand(bytes(_addressToString(address(uint160(tokenID)))));

		_setColor(svg, randseed, 1);
		_setColor(svg, randseed, 0);
		_setColor(svg, randseed, 2);

		for (uint256 y = 0; y < 8; y++) {
			uint8 p0 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p1 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p2 = uint8((_rand(randseed) * 23) / 2147483648 / 10);
			uint8 p3 = uint8((_rand(randseed) * 23) / 2147483648 / 10);

			_setPixel(svg, 0, y, p0);
			_setPixel(svg, 1, y, p1);
			_setPixel(svg, 2, y, p2);
			_setPixel(svg, 3, y, p3);
			_setPixel(svg, 4, y, p3);
			_setPixel(svg, 5, y, p2);
			_setPixel(svg, 6, y, p1);
			_setPixel(svg, 7, y, p0);
		}

		return svg;
	}
}
