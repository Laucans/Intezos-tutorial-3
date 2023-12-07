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
    //TODO
  };

  const fetchTransferToClaim = async () => {
    //TODO
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
