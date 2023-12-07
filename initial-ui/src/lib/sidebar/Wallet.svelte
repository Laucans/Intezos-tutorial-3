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
