<script lang="ts">
  import CustomList from "./base/CustomList.svelte";
  import ConfirmationModal from "../../modal/ConfirmationModal.svelte";
  import {
    indexerAPIURL,
    contractStorageBigMapID,
    intezosAddress,
  } from "../../../config";
  import store from "../../../store";
  import { displayTokenAmount } from "../../../utils";
  import { onMount } from "svelte";
  import type {
    IntezosWalletType,
    RedeemParam,
  } from "../../contracts/types/intezos.types";
  import type { timestamp, address } from "../../contracts/types/type-aliases";

  let showRedeemModal = false;
  let data = [];
  let userAddress = "";
  let selectedItem: any = {};

  async function handleModalRedeemClosed() {
    let redeemParam: RedeemParam = {
      receiver: selectedItem.address as address,
      transfer_timestamp: selectedItem.date as timestamp,
    };

    const intezosContract = await $store.Tezos.wallet.at<IntezosWalletType>(
      intezosAddress
    );
    intezosContract.methodsObject
      .redeem(redeemParam)
      .send()
      .finally(() => {
        setTimeout(() => {
          store.updateEventCount();
        }, 15000);
      });
    showRedeemModal = false;
  }

  const fetchTransferLedger = async () => {
    try {
      const response = await fetch(
        `${indexerAPIURL}bigmaps/${contractStorageBigMapID}/keys`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return await response.json();
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  };

  const fetchTransferToRedeem = async () => {
    const jsonData = await fetchTransferLedger();
    data = jsonData
      .filter(
        (item) =>
          item.value.pending === true && item.key.sender == $store.userAddress
      )
      .map((item) => ({
        address: item.key.sender,
        amount: displayTokenAmount(item.value.amount, "XTZ"),
        date: new Date(item.key.transfer_timestamp).toISOString(),
        reason: item.value.reason,
      }));
  };

  // Event when the store is updated.
  store.subscribe((newStore) => {
    userAddress = newStore.userAddress;
    fetchTransferToRedeem();
  });

  onMount(async () => {
    userAddress = $store.userAddress;
  });

  function redeem() {}
</script>

<div>
  <CustomList
    {data}
    on:listButtonCliked={(event) => {
      selectedItem = event.detail;
      showRedeemModal = true;
    }}
    buttonLabel="Redeem"
  />
  <ConfirmationModal
    isOpen={showRedeemModal}
    on:modalConfirmed={handleModalRedeemClosed}
    on:modalConfirmed={redeem}
    modalTitle="Redeem"
    modalText="You will redeem the transfer sent to {selectedItem.address} for {selectedItem.reason} ({selectedItem.amount}xtz).Are you sure ?"
  />
</div>

<style>
</style>
