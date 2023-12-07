<script>
  import CustomList from "./base/CustomList.svelte";
  import store from "../../../store";
  import ClaimModal from "../../modal/ClaimModal.svelte";
  import { onMount } from "svelte";
  import { displayTokenAmount } from "../../../utils";
  import { indexerAPIURL, contractStorageBigMapID } from "../../../config";

  let showClaimModal = false;
  let data = [];
  let selectedItem = {};

  function handleModalClaimClosed() {
    showClaimModal = false;
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

  const fetchTransferToClaim = async () => {
    const jsonData = await fetchTransferLedger();
    data = jsonData
      .filter(
        (item) =>
          item.value.pending === true && item.key.receiver == $store.userAddress
      )
      .map((item) => ({
        address: item.key.sender,
        amount: displayTokenAmount(item.value.amount, "XTZ"),
        date: new Date(item.key.transfer_timestamp).toISOString(),
        reason: item.value.reason,
        question: item.value.secret.question,
      }));
  };

  // Event when the store is updated.
  store.subscribe(() => {
    fetchTransferToClaim();
  });

  onMount(async () => {});
</script>

<div>
  <CustomList
    {data}
    on:listButtonCliked={(event) => {
      selectedItem = event.detail;
      showClaimModal = true;
    }}
    buttonLabel="Claim"
  />
  <ClaimModal
    isOpen={showClaimModal}
    on:modalClaimClosed={handleModalClaimClosed}
    question={selectedItem.question}
    amount={selectedItem.amount}
    senderAddress={$store.userAddress}
    transfer_timestamp={selectedItem.date}
  />
</div>

<style>
</style>
