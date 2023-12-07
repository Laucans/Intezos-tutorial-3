<script lang="ts">
  import { onMount } from "svelte";
  import type { BeaconWallet } from "@taquito/beacon-wallet";
  import store, { type TezosAccountAddress } from "../../store";
  import { rpcUrl, network } from "../../config";
  import { shortenHash, fetchBalances, displayTokenAmount } from "../../utils";

  let connectedNetwork = "";
  let walletProviderName = "";
  let balance = "...";

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
    balance = displayTokenAmount($store.userBalances.XTZ, "XTZ");
  };

  const connect = async () => {
    const activeAccount = await $store.wallet.client.getActiveAccount();
    const isConnected = !!activeAccount;
    if (!isConnected) {
      await $store.wallet.requestPermissions({
        network: { type: network, rpcUrl },
      });
    }
    // Configure the Tezos toolkit with our wallet
    console.log("setWalletProvider");
    $store.Tezos.setWalletProvider($store.wallet);
    // finds account info
    await initInfo($store.wallet);
  };

  const disconnect = async () => {
    $store.wallet.client.clearActiveAccount();
    store.updateUserAddress(undefined);
    store.updateUserBalances("XTZ", undefined);
    connectedNetwork = "";
    walletProviderName = "";
    balance = "Cannot be retrieve";
  };

  onMount(async () => {
    await connect();
  });
</script>

<div class="wallet">
  {#if $store.wallet && $store.userAddress}
    <div class="wallet__info">
      <p>
        <span>{shortenHash($store.userAddress)}</span>
      </p>
      <p>Balance : {balance} XTZ</p>
      {#if walletProviderName}
        <p style="font-size:0.7rem">({walletProviderName})</p>
      {/if}
      <p>
        {#if connectedNetwork}
          On {connectedNetwork}
        {:else}
          No network data
        {/if}
      </p>
    </div>
    <button class="wallet-button" on:click={disconnect}> Disconnect </button>
  {:else}
    <button class="wallet-button" on:click={connect}> Connect wallet </button>
  {/if}
</div>

<style lang="scss">
  @import "../../styles/settings.scss";

  .wallet {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 10%;

    .wallet-button {
      background-color: $tezos-blue;
      color: $white;
      min-height: 25px;
    }
    .wallet__info {
      padding-bottom: 20px;
      text-align: center;

      p {
        margin: 0px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        img.wallet-icon {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
</style>
