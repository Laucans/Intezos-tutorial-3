# Intezos P3

This tutorial will focus on how to use your contract with a web application.

## Goal 
Integrate contract built in https://github.com/Laucans/Intezos-tutorial-2 with a dApp (for decentralized application, refer to app using blockchain)

## Technologies

Ligo for contract
Svelte + Vite for frontend. :warning: This is not a svelte or vite tutorial.

## You will learn
- Connect a wallet with your application through Taquito and beacon
- Call your contract endpoint with your application
- Retrieve your contract state with an indexer API
- Transform String into Bytes understandable by Tezos blockchain

# 1. Pre-requisite.
- Be sure you followed or understand concepts of https://github.com/Laucans/Intezos-tutorial-1 and https://github.com/Laucans/Intezos-tutorial-2  
- You understand basis of web-development
- You know what a wallet is
- You know how to deploy a contract on ghostnet (explained in https://github.com/Laucans/Intezos-tutorial-1)
---
## Initialize your dApp from bootstrap

The project is already initialized with a bootstrap in `initial-ui` folder containing : 
- Libraries installed
- A vite config to be able to run tezos dApp
- Some components with functions to implements
- Some Css for components

> If you want more informations about the initial bootstrap, check [bootstrap.md](./bootstrap.md)

Now run the UI server :
```bash
cp -r initial-ui ui && cd ui && npm i && npm run dev
```

## Deploy your contract

[Following instruction](https://github.com/Laucans/Intezos-tutorial-1#deploy-it-on-the-testnet-) deploy your contract on testnet and make sure you can call it. When it has been deployed, update `intezosAddress` constant in `config.ts`.

## Understand dependencies

As you can see, a button connect wallet is available in the sidebar. We will now implement the behaviour.

If you open your `package.json` file you will see 3 dependencies :

```json
    "@airgap/beacon-sdk": "^4.0.6",
```
Useful to have access to `NetworkType`, necessary to setup `BeaconWallet`. 
Also necessary to configure vite server. More information in `bootstrap.md`

```json
    "@taquito/beacon-wallet": "^17.1.1",
```
Make `BeaconWallet` available, used for interaction with user wallet.  

```json
    "@taquito/taquito": "^17.1.1"
```
Make `TezosToolkit` available, used for interaction with RPC nodes and so the chain.  

## Configure the wallet connection

### Setup your store

Your wallet infos will be stored in your store. Open the file `ui/src/store.ts` which has already been implemented. The state contains 3 informations from the wallet : 
- 1. The beacon wallet itself, representing the connection(stream) to your wallet provider
- 2. The Address of the user which is the public key hash of the user.
- 3. The user Balance.

You can see that the `BeaconWallet` and `TezosToolkit` are already initialized. `BeaconWallet` is not related to any wallet yet.

> Instantiation of the wallet : [BeaconWallet](https://tezostaquito.io/docs/wallet_api)(options: [DAppClientOptions](https://typedocs.walletbeacon.io/interfaces/dappclientoptions.html#name)): [BeaconWallet](https://tezostaquito.io/docs/wallet_api)

### Setup wallet connection

Open the file `ui/src/lib/sidebar/Wallet.svelte`. This file contain a skeletton of the Wallet implementation. You can see 4 functions :

```typescript
const initInfo = async (wallet: BeaconWallet) => {
    //TODO
  };

  const connect = async () => {
    //TODO
  };

  const disconnect = async () => {
    //TODO
  };

  onMount(async () => {
    //TODO
  });
```
#### connect implementation
The connect function is the `onClick` action of the button connect wallet. 

Then we will request the permission to the user. This instruction will trigger a modal to connect your wallet, and instantiate the connection with your wallet provider.
```typescript
await $store.wallet.requestPermissions({
      network: { type: network, rpcUrl }
    });
```
And finally, let's configure the TezosToolkit from the store
```typescript
    // Instantiate the Tezos toolkit
    $store.Tezos.setWalletProvider($store.wallet);
```
> Note : The `TezosToolkit` have to be instantiated on the application bootstrap, open src/App.svelte to see the global `onMount` function which instantiates the `TezosToolkit` with `rpcUrl`

Now we are connected to the wallet and Tezos chain, let's retrieve informations from it 

#### initInfo implementation
Call `initInfo` in `connect` function
```typescript
  const connect = async () => {
    const activeAccount = await $store.wallet.client.getActiveAccount();
    const isConnected = !!activeAccount
    if(! isConnected) {
      await $store.wallet.requestPermissions({
        network: { type: network, rpcUrl }
      });
    }
    // Configure the Tezos toolkit with our wallet
    $store.Tezos.setWalletProvider($store.wallet);
    // finds account info
    await initInfo($store.wallet);
  };
```
Now we want to retrieve some informations from the wallet to be displayed on to your UI : 
- Info of the network
- Info about the provider
- The user address
- The user balance

Let's implement it :
```typescript
  const initInfo = async (wallet: BeaconWallet) => {
    // Retrieve network Info
    const accountInfo = await wallet.client.getActiveAccount();
    if (accountInfo?.network?.type) {
      connectedNetwork = accountInfo.network.type;
    } else {
      connectedNetwork = "";
    }

    // Retrieve user address
    const userAddress = (await wallet.getPKH()) as TezosAccountAddress;
    store.updateUserAddress(userAddress);

    // Retrieve wallet provider name
    const info = await wallet.client.getPeers();
    walletProviderName = info[0].name;

    // fetches user's XTZ balance
    const res = await fetchBalances($store.Tezos, userAddress);
    store.updateUserBalances("XTZ", res.mutezBalance);
    // Because balance is retrieve in mutez, the lowest value of a xtz, we want to convert it for display as an xtz amount. 
    balance = displayTokenAmount($store.userBalances.XTZ, "XTZ")
  };
```

Now you can click over the connect button, you should be able to see your connection information. 
But the disconnect button still useless, let implement it.

#### disconnect implementation

Only needs to disconnect the wallet, is to call `clearActiveAccount` from your wallet and clear your storage like this

```typescript
  const disconnect = async () => {
    $store.wallet.client.clearActiveAccount();
    store.updateUserAddress(undefined);
    store.updateUserBalance(undefined)
    connectedNetwork = "";
    walletProviderName = "";
    balance = "...";
  };
```
> From [Beacon Wallet documentation.](https://docs.walletbeacon.io/getting-started/advanced-example/) 
> ```typescript
>   // If you want to "disconnect" a wallet, clear the active account.
>   // This means the next time the active account is checked or a permission request is triggered, it will be like it's the users first interaction.
> await dAppClient.clearActiveAccount();
> ```

#### onMount implementation
If your wallet is already on storage, you want to mimic the "connect" operation

```typescript
  onMount(async () => {
    await connect()
  });
```

## Call your contract from the UI

Make sure your followed  [Deploy your contract]() section and `intezosAddress` is configured.

### Generate your contract types with taqueria

From the root folder, we are going to use a [taqueria plugin](https://taqueria.io/docs/plugins/plugin-contract-types/) to generate typescript [types](https://taqueria.io/docs/tasks/generate-types/) 

```sh
taq install @taqueria/plugin-contract-types
taq generate types ./ui/src/lib/contracts/types
```   
Then check generated files (you can fix them if you see issue for example if verbatimModuleSyntax is enabled ):
- `intezos.code.ts` Represent the code of your contract, useful if you want to deploy it from your UI (like what can be done via contract of Intezos-1)
- `intezos.types.ts` Represent types of your contract, useful to deal with it.
- `type-aliases.ts` A common file which represent michelson type (which are also implemented in ligo)
- `type-utils.ts` A common file which contains some utilitary types

## Implement contract transfer call

We will implement the behaviour of `ui/src/lib/modal/TransferModal.svelte`  
We want to use interface previously generated in the file `intezos.types.ts` to call our smart contract in : 
```typescript
  async function sendTransfer(event) {
    //TODO
  }
```
If you open `intezos.types.ts` you will see the interface with our contract, but how taqueria generate the file we are not able to type our parameter, I prefer to edit the file to extract the types. So for transfer :  
```typescript
type MethodsObject = {
    redeem: (params: {
        receiver: address,
        transfer_timestamp: timestamp,
    }) => Promise<void>;
    claim: (params: {
        sender: address,
        transfer_timestamp: timestamp,
        answer: bytes,
    }) => Promise<void>;
    transfer: (params: {
        receiver: address,
        reason: string,
        question: string,
        encrypted_answer: bytes,
        encryption_algorithm: string,
    }) => Promise<void>;
};
```
Became : 
```typescript 
export type TransferParam = {
  receiver: address;
  reason: string;
  secret: {
    question: string;
    encrypted_answer: bytes;
    encryption_algorithm: string;
  };
};

type MethodsObject = {
  redeem: (params: {
      receiver: address,
      transfer_timestamp: timestamp,
  }) => Promise<void>;
  claim: (params: {
      sender: address,
      transfer_timestamp: timestamp,
      answer: bytes,
  }) => Promise<void>;
  transfer: (params: TransferParam) => Promise<void>;
};
```
Now we can edit `sendTransfer` to :
```typescript 
let transferParam: TransferParam = {
  receiver: recipientAddress,
  reason: reason,
  secret: {
    question: secretQuestion,
    encrypted_answer: hashSha256String(secretAnswer) as bytes,
    encryption_algorithm: "SHA256"
  }
}
```
> import necessary types !   

As you can see for `encrypted_answer` we have to create `bytes` built from the `sha256` of our secret (to ensure that the answer is not readable in indexer when creating the transfer).

To implement `hashSha256String` we have to[ use `packData` from `@taquito/michel-codec`](https://www.npmjs.com/package/@taquito/michel-codec#pack-michelson-data), the [crypto polyfill](https://nodejs.org/api/crypto.html) for `createHash` and [buffer polyfill](https://nodejs.org/api/buffer.html)
So install them via :
```shell
npm i crypto-browserify buffer @taquito/michel-codec
```
And edit your vite.config.ts 
```typescript
alias: {
    // polyfills
    "readable-stream": "vite-compatible-readable-stream",
    stream: "vite-compatible-readable-stream",
    buffer: "buffer",
    crypto: "crypto-browserify"
  }
```
Then you can implement `hashSha256String`:
```typescript
const hashSha256String = (string: string) => {
  const typ: MichelsonType = {
    prim: 'string'
  };
  const data = {
      string,
  };
  // Pack the data like Bytes.pack in Ligo.
  const packed = packData(data, typ);
  // Encrypt into sha256
  const buffer = Buffer.from(packed);
  const hash = createHash('sha256').update(buffer).digest("hex");
  return "0x"+hash
}
```

Now your parameter is ready, you have to call the contract
```typescript
  async function sendTransfer(event) {
  ...
    // Declare the connection between your wallet and your contract using taquito(Tezos.wallet.at) + taqueria type(IntezosWalletType)
    const intezosContract = await $store.Tezos.wallet.at<IntezosWalletType>(intezosAddress);
    // Call transfer entrypoint using 
    // Note that the amount is directly linked to the call, not in Param, that is why you
    // retrieve it with Tezos.get_amount() in ligo.
    intezosContract.methodsObject.transfer( transferParam ).send({ amount: amount })
    // Close the popup
    dispatchClosed(event)
  }
```

## List transactions to claim 

Open the file `ui/src/lib/interface/list/ClaimList.svelte`.

Goal is to load and map transfers contained in `transfer_ledger` of your contract into variable `data` when your wallet is connected.
There is different way to retrieve your storage content :
- [On chain view](https://ligolang.org/docs/contract/views?lang=jsligo#defining-on-chain-views)
- [Off chain view](https://ligolang.org/docs/contract/views?lang=jsligo#defining-on-chain-views)
- [Indexer API like tzkt](https://api.ghostnet.tzkt.io/#operation/BigMaps_GetKeys)

Because `Big_map` are lazy and we want to retrieve all the storage, we will use the Indexer API to simplify code.

> Your application will be dependent to [tzkt.io](https://tzkt.io). You have to trust them on to availability and data trustworthiness.

### Retrieve the tzkt id of your big_map  
Start by calling [Contract_GetStorage](https://api.ghostnet.tzkt.io/#operation/Contracts_GetStorage) to retrieve the id of your big_map.

The id of the `big_map` will not change, that's why we will store it directly into constant `contractStorageBigMapID` of  `ui/src/config.ts` of our app. To find the id execute : 

```sh
curl https://api.ghostnet.tzkt.io/v1/contracts/<contract_address_KT1>/bigmaps | jq '.[0].ptr'
```

### Retrieve smart contract datas indexed by tzkt

Call [BigMaps_GetKeys](https://api.ghostnet.tzkt.io/#operation/BigMaps_GetKeys) to retrieve the content of your storage and map it into your data.

```typescript
  const fetchTransferLedger = async () => {
    try {
      const response = await fetch(`${indexerAPIURL}bigmaps/${contractStorageBigMapID}/keys`);      
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return await response.json();
    } catch (error) {
      console.error('There was a problem fetching the data:', error);
    }
  }

  const fetchTransferToClaim = async () => {
    const jsonData = await fetchTransferLedger();
    data = jsonData
      .filter(item => item.value.pending === true && item.key.receiver == $store.userAddress)
      .map(item => ({
        address: item.key.sender,
        amount: displayTokenAmount(item.value.amount, "XTZ"),
        date: new Date(item.key.transfer_timestamp).toISOString().split('T')[0],
        reason: item.value.reason
      }));
  }
```

You can test it by doing a transfer to your address, but the version is not dynamic, you will have to refresh the page to see it into the claim list and the amount of your wallet updated

## Implement the rest of the dApp

Now you should be able to implement the dApp alone, every new concepts has been explained.
- [] Behaviour of `ui/src/lib/modal/ClaimModal.svelte` looks like `ui/src/lib/modal/TransferModal.svelte`
- [] Behaviour of `ui/src/lib/interface/list/RedeemList.svelte` looks like `ui/src/lib/interface/list/ClaimList.svelte`
- [] Redeem endpoint have to be call in `handleModalRedeemClosed` in `ui/src/lib/interface/list/RedeemList.svelte`
- [] Refactor your application to store datas retrieved from the indexer into your store
- [] Make event management better to have a dynamic datas when an event is dispatched 

### Tips 

This is how to transform your string into bytes understandable by tezos chain.
```typescript
const typ: MichelsonType = {
  prim: 'string'
};
const data = {
    string: answer,
};
const packed = packDataBytes(data, typ);
const bytes = packed.bytes as bytes;
```

If you want to make the application more dynamic, you can add this to your smart contract call, it will wait 15 second (time of 1 block) before to propagate an event into the store. Then the UI should retrigger the fetch of the different lists and the amount of the wallet :
```typescript
.finally(() => {
        setTimeout(() => {
          store.updateEventCount();
        }, 15000);
      });
```

# What next ?

Currently there is a bug in our smartContract. Let's find it by implementing tests on to our contract in part 4 ! 
