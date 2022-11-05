# On-chain Blockies

[Twitter announcement](https://twitter.com/wighawag/status/1588162036084547584)



[Blockies](https://github.com/ethereum/blockies) but generated on-chain in solidity

## INSTALL

```bash
pnpm i
```

## run a node, a web server and a contract deployer (automatic on code changes)

```bash
pnpm geth:dev
```

You can then navigate on [http://localhost:4242](http://localhost:4242)

it will pick the last ERC721 transfer event and display the corresponding token

You can also specify a specifc token this way: `http://localhost:4242#<contract address>_<token id>`

you can mint more token via

```
pnpm execute localhost scripts/mint.ts <tokenID>
```

example :

```
pnpm execute localhost scripts/mint.ts 0x000000000000000000000388c818ca8b9251b393
```
