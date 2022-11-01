// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solidity-kit/solc_0.8/ERC721/implementations/BasicERC721.sol";

abstract contract ERC721OwnedByAll is BasicERC721, IERC721Supply {
	/// @inheritdoc IERC721
	function balanceOf(address owner) public view override returns (uint256 balance) {
		balance = super.balanceOf(owner);

		(, uint256 blockNumber) = _ownerAndBlockNumberOf(uint256(uint160(owner)));
		if (blockNumber == 0) {
			// self token was never registered
			unchecked {
				balance++;
			}
		}
	}

	/// @inheritdoc IERC721WithBlocknumber
	function ownerAndLastTransferBlockNumberList(uint256[] calldata ids)
		external
		view
		override
		returns (OwnerData[] memory ownersData)
	{
		ownersData = new OwnerData[](ids.length);
		for (uint256 i = 0; i < ids.length; i++) {
			uint256 id = ids[i];
			uint256 data = _owners[id];
			address owner = address(uint160(data));
			if (owner == address(0) && id < 2**160) {
				owner = address(uint160(id));
			}
			ownersData[i].owner = owner;
			ownersData[i].lastTransferBlockNumber = (data >> 160) & 0xFFFFFFFFFFFFFFFFFFFFFF;
		}
	}

	/// @inheritdoc IERC721Supply
	function totalSupply() external pure returns (uint256) {
		return 2**160 - 1; // do not count token with id zero whose owner would otherwise be the zero address
	}

	// ------------------------------------------------------------------------------------------------------------------
	// INTERNALS
	// ------------------------------------------------------------------------------------------------------------------

	function _ownerOf(uint256 id) internal view override returns (address owner) {
		owner = super._ownerOf(id);
		if (owner == address(0) && id < 2**160) {
			owner = address(uint160(id));
		}
	}

	function _ownerAndOperatorEnabledOf(uint256 id)
		internal
		view
		override
		returns (address owner, bool operatorEnabled)
	{
		(owner, operatorEnabled) = super._ownerAndOperatorEnabledOf(id);
		if (owner == address(0) && id < 2**160) {
			owner = address(uint160(id));
		}
	}

	function _ownerAndBlockNumberOf(uint256 id) internal view override returns (address owner, uint256 blockNumber) {
		(owner, blockNumber) = super._ownerAndBlockNumberOf(id);
		if (owner == address(0) && id < 2**160) {
			owner = address(uint160(id));
		}
	}

	function _ownerBlockNumberAndOperatorEnabledOf(uint256 id)
		internal
		view
		override
		returns (
			address owner,
			uint256 blockNumber,
			bool operatorEnabled
		)
	{
		(owner, blockNumber, operatorEnabled) = super._ownerBlockNumberAndOperatorEnabledOf(id);
		if (owner == address(0) && id < 2**160) {
			owner = address(uint160(id));
		}
	}
}
