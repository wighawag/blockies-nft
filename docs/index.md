
# On-chain Blockies
Blockies as NFTs. Each ethereum address owns its own Blocky NFT. No minting needed. You can even use Permit (EIP-4494) to approve transfers from smart contracts, via signatures. Note that unless you transfer or call `emitSelfTransferEvent` first, indexers would not know of your token. So if you want your Blocky to shows up, you can call `emitSelfTransferEvent(<your address>)`.

## **Methods**


----

### **DOMAIN_SEPARATOR()**

EIP-712 Domain separator hash




----

### **approve(address,uint256)**

Approve an operator to transfer a specific token on the senders behalf.

Params:
 - `operator`: The address receiving the approval.
 - `tokenID`: The id of the token.



----

### **balanceOf(address)**

Get the number of tokens owned by an address.

Params:
 - `owner`: The address to look for.

Returns:
 - `balance`: The number of tokens owned by the address.


----

### **claimOwnership(uint256)**

claim ownership of the blocky owned by a contract.   Will only work  if you are the owner of that contract (EIP-173).

Params:
 - `tokenID`: blocky address to claim



----

### **contractURI()**

Returns the Uniform Resource Identifier (URI) for the token collection.




----

### **eip712Domain()**

The return values of this function MUST describe the domain separator that is used for verification of EIP-712 signatures in the contract. They describe both the form of the EIP712Domain struct (i.e., which of the optional fields and extensions are present) and the value of each field, as follows.


Returns:
 - `fields`: A bit map where bit i is set to 1 if and only if domain field i is present (0 ≤ i ≤ 4). Bits are read from least significant to most significant, and fields are indexed in the order that is specified by EIP-712, identical to the order in which they are listed in the function type.
 - `name`: EIP-712 name
 - `version`: EIP-712 version
 - `chainID`: EIP-712 chainID
 - `verifyingContract`: EIP-712 name verifyingContract
 - `salt`: EIP-712 salt
 - `extensions`: A list of EIP numbers that specify additional fields in the domain. The method to obtain the value for each of these additional fields and any conditions for inclusion are expected to be specified in the respective EIP. The value of fields does not affect their inclusion.


----

### **emitSelfTransferEvent(uint256)**

emit a Transfer event where from &#x3D;&#x3D; to so that indexers can scan the token.   This can be called by anyone at any time and does not change state.   As such it keeps the token&#x27;s approval state and will re-emit an Approval event to indicate that if needed.

Params:
 - `tokenID`: token to emit the event for.



----

### **getApproved(uint256)**

Get the approved operator for a specific token.

Params:
 - `tokenID`: The id of the token.

Returns:
 - `operator`: The address of the operator.


----

### **isApprovedForAll(address,address)**

Check if the sender approved the operator.

Params:
 - `owner`: The address of the owner.
 - `operator`: The address of the operator.

Returns:
 - `isOperator`: The status of the approval.


----

### **name()**

A descriptive name for a collection of NFTs in this contract




----

### **nonces(uint256)**

Allows to retrieve current nonce for token


Returns:
 - `nonce`: token nonce


----

### **nonces(address)**

Allows to retrieve current nonce for the account

Params:
 - `account`: account to query

Returns:
 - `nonce`: account's nonce


----

### **owner()**

Get the address of the owner




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
 - `owner`: The address of the token owner.
 - `blockNumber`: The blocknumber at which the last transfer of that id happened.


----

### **ownerOf(uint256)**

Get the owner of a token.

Params:
 - `tokenID`: The id of the token.

Returns:
 - `owner`: The address of the token owner.


----

### **permit(address,uint256,uint256,bytes)**

function to be called by anyone to approve &#x60;spender&#x60; using a Permit signature

Params:
 - `spender`: the actor to approve
 - `tokenID`: the token id
 - `deadline`: the deadline for the permit to be used



----

### **permitForAll(address,address,uint256,bytes)**

function to be called by anyone to approve &#x60;spender&#x60; using a Permit signature

Params:
 - `spender`: the actor to approve
 - `deadline`: the deadline for the permit to be used



----

### **safeTransferFrom(address,address,uint256)**

Transfer a token between 2 addresses letting the receiver know of the transfer.

Params:
 - `from`: The send of the token.
 - `to`: The recipient of the token.
 - `tokenID`: The id of the token.



----

### **safeTransferFrom(address,address,uint256,bytes)**

Transfer a token between 2 addresses letting the receiver knows of the transfer.

Params:
 - `from`: The sender of the token.
 - `to`: The recipient of the token.
 - `tokenID`: The id of the token.
 - `data`: Additional data.



----

### **setApprovalForAll(address,bool)**

Set the approval for an operator to manage all the tokens of the sender.

Params:
 - `operator`: The address receiving the approval.
 - `approved`: The determination of the approval.



----

### **setENSName(string)**

set the reverse-record name for this contract

Params:
 - `name`: ENS name to set



----

### **supportsInterface(bytes4)**

Query if a contract implements an interface

Params:
 - `interfaceID`: The interface identifier, as specified in ERC-165



----

### **symbol()**

An abbreviated name for NFTs in this contract




----

### **tokenNonces(uint256)**

Allows to retrieve current nonce for token

Params:
 - `tokenID`: token id

Returns:
 - `nonce`: token nonce


----

### **tokenURI(uint256)**

A distinct Uniform Resource Identifier (URI) for a given asset.

Params:
 - `tokenID`: id of the token being queried.



----

### **transferFrom(address,address,uint256)**

Transfer a token between 2 addresses.

Params:
 - `from`: The sender of the token.
 - `to`: The recipient of the token.
 - `tokenID`: The id of the token.



----

### **transferOwnership(address)**

Set the address of the new owner of the contract

Params:
 - `newOwner`: The address of the new owner of the contract



## **Events**

### `event` Approval(address,address,uint256)

Triggered when a token is approved to be sent by another account  Note tat the approval get reset when a Transfer event for that same token is emitted.


### `event` ApprovalForAll(address,address,bool)

Triggered when an account approve or disaprove another to transfer on its behalf


### `event` OwnershipTransferred(address,address)

This emits when ownership of the contract changes.


### `event` Transfer(address,address,uint256)

Triggered when a token is transferred



## **Errors**

### `error` AlreadyClaimed()

You attempted to claim a Blocky from an EIP-173 contract (using owner()) while the Blocky has already been claimed or transfered.


### `error` DeadlineOver(uint256,uint256)

The permit has expired

Params:
 - `currentTime`: time at which the error happen
 - `deadline`: the deadline

### `error` InvalidAddress(address)

An invalid address is specified (for example: zero address)

Params:
 - `addr`: invalid address

### `error` InvalidSignature()

The signature do not match the expected signer


### `error` NonExistentToken(uint256)

The token does not exist

Params:
 - `tokenID`: id of the expected token

### `error` NonceOverflow()

The Nonce overflowed, make a transfer to self to allow new nonces.


### `error` NotAuthorized()

Not authorized to perform this operation


### `error` NotOwner(address,address)

The address from which the token is sent is not the current owner

Params:
 - `provided`: the address expected to be the current owner
 - `currentOwner`: the current owner

### `error` TransferRejected()

The Transfer was rejected by the destination





