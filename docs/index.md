
## Blockies on-chain
Blockies as NFT. Each ethereum address owns its own one. No minting needed. You can even use Permit (EIP-4494) to approve contracts via signatures. Note though that unless you transfer or call `emitSelfTransferEvent` indexer would not know of your token.


----

### **approve(address,uint256)**

Approve an operator to transfer a specific token on the senders behalf.

Params:
 - `operator`: The address receiving the approval.
 - `tokenId`: The id of the token.



----

### **balanceOf(address)**

Get the number of tokens owned by an address.

Params:
 - `owner`: The address to look for.

Returns:
 - `balance`: The number of tokens owned by the address.


----

### **eip712Domain()**

The return values of this function MUST describe the domain separator that is used for verification of EIP-712 signatures in the contract. They describe both the form of the EIP712Domain struct (i.e., which of the optional fields and extensions are present) and the value of each field, as follows.


Returns:
 - `chainId`: EIP-712 chainId
 - `extensions`: A list of EIP numbers that specify additional fields in the domain. The method to obtain the value for each of these additional fields and any conditions for inclusion are expected to be specified in the respective EIP. The value of fields does not affect their inclusion.
 - `fields`: A bit map where bit i is set to 1 if and only if domain field i is present (0 ≤ i ≤ 4). Bits are read from least significant to most significant, and fields are indexed in the order that is specified by EIP-712, identical to the order in which they are listed in the function type.
 - `name`: EIP-712 name
 - `salt`: EIP-712 salt
 - `verifyingContract`: EIP-712 name verifyingContract
 - `version`: EIP-712 version


----

### **emitSelfTransferEvent(uint256)**

emit Transfer event so that indexer can pick it up.   This can be called by anyone at any time and does not change state   As such it keeps the token&#x27;s operator-approval state and will re-emit an Approval event to indicate that.

Params:
 - `id`: tokenID to emit the event for.



----

### **getApproved(uint256)**

Get the approved operator for a specific token.

Params:
 - `tokenId`: The id of the token.

Returns:
 - `operator`: The address of the operator.


----

### **isApprovedForAll(address,address)**

Check if the sender approved the operator.

Params:
 - `operator`: The address of the operator.
 - `owner`: The address of the owner.

Returns:
 - `isOperator`: The status of the approval.


----

### **nonces(address)**

Allows to retrieve current nonce for the account

Params:
 - `account`: account to query

Returns:
 - `nonce`: account's nonce


----

### **nonces(uint256)**

Allows to retrieve current nonce for token

Params:
 - `tokenId`: token id

Returns:
 - `nonce`: token nonce


----

### **ownerAndLastTransferBlockNumberList(uint256[])**

Get the list of owner of a token and the blockNumber of its last transfer, useful to voting mechanism.

Params:
 - `ids`: The list of token ids to check.

Returns:
 - `ownersData`: The list of (owner, lastTransferBlockNumber) for each ids given as input.


----

### **ownerAndLastTransferBlockNumberOf(uint256)**

Get the owner of a token and the blockNumber of the last transfer, useful to voting mechanism.

Params:
 - `id`: The id of the token.

Returns:
 - `blockNumber`: The blocknumber at which the last transfer of that id happened.
 - `owner`: The address of the token owner.


----

### **ownerOf(uint256)**

Get the owner of a token.

Params:
 - `tokenId`: The id of the token.

Returns:
 - `owner`: The address of the token owner.


----

### **permit(address,uint256,uint256,bytes)**

function to be called by anyone to approve &#x60;spender&#x60; using a Permit signature

Params:
 - `deadline`: the deadline for the permit to be used
 - `signature`: permit
 - `spender`: the actor to approve
 - `tokenId`: the token id



----

### **permitForAll(address,address,uint256,bytes)**

function to be called by anyone to approve &#x60;spender&#x60; using a Permit signature

Params:
 - `deadline`: the deadline for the permit to be used
 - `signature`: permit
 - `signer`: the one giving permission
 - `spender`: the actor to approve



----

### **safeTransferFrom(address,address,uint256)**

Transfer a token between 2 addresses letting the receiver know of the transfer.

Params:
 - `from`: The send of the token.
 - `to`: The recipient of the token.
 - `tokenId`: The id of the token.



----

### **safeTransferFrom(address,address,uint256,bytes)**

Transfer a token between 2 addresses letting the receiver knows of the transfer.

Params:
 - `data`: Additional data.
 - `from`: The sender of the token.
 - `to`: The recipient of the token.
 - `tokenId`: The id of the token.



----

### **setApprovalForAll(address,bool)**

Set the approval for an operator to manage all the tokens of the sender.

Params:
 - `approved`: The determination of the approval.
 - `operator`: The address receiving the approval.



----

### **supportsInterface(bytes4)**

Query if a contract implements an interface

Params:
 - `interfaceID`: The interface identifier, as specified in ERC-165

Returns:
 - `true` if the contract implements `interfaceID` and  `interfaceID` is not 0xffffffff, `false` otherwise


----

### **tokenNonces(uint256)**

Allows to retrieve current nonce for token

Params:
 - `tokenId`: token id

Returns:
 - `nonce`: token nonce


----

### **tokenURI(uint256)**

A distinct Uniform Resource Identifier (URI) for a given asset.




----

### **transferFrom(address,address,uint256)**

Transfer a token between 2 addresses.

Params:
 - `from`: The sender of the token.
 - `to`: The recipient of the token.
 - `tokenId`: The id of the token.



----

### **DOMAIN_SEPARATOR()**

EIP-712 Domain separator hash




----

### **name()**

A descriptive name for a collection of NFTs in this contract




----

### **symbol()**

An abbreviated name for NFTs in this contract






