<script lang="ts">
  import Modal from "./base/Modal.svelte";
  import LabelInput from "../inputs/LabelInput.svelte";
  import type {
    IntezosWalletType,
    ClaimParam,
  } from "../contracts/types/intezos.types";
  import { createEventDispatcher } from "svelte";
  import { intezosAddress } from "../../config";
  import store from "../../store";
  import {
    type bytes,
    type timestamp,
    type address,
    tas,
  } from "../contracts/types/type-aliases";
  import { type MichelsonType, packDataBytes } from "@taquito/michel-codec";

  // Modal properties
  export let isOpen = false;
  export let question = "default question";
  export let amount = -1;
  export let senderAddress = undefined;
  export let transfer_timestamp = undefined;

  // Modal form data
  let answer: string = "";

  // Event
  const dispatch = createEventDispatcher();

  function dispatchClosed(event) {
    dispatch("modalClaimClosed", event.detail);
  }

  async function claim(event) {
    const typ: MichelsonType = {
      prim: "string",
    };
    const data = {
      string: answer,
    };
    const packed = packDataBytes(data, typ);

    let claimParam: ClaimParam = {
      sender: senderAddress as address,
      transfer_timestamp: transfer_timestamp as timestamp,
      answer:  tas.bytes(packed.bytes),
    };

    const intezosContract = await $store.Tezos.wallet.at<IntezosWalletType>(
      intezosAddress
    );
    intezosContract.methodsObject
      .claim(claimParam)
      .send()
      .finally(() => {
        setTimeout(() => {
          store.updateEventCount();
        }, 15000);
      });
    dispatchClosed(event);
  }
</script>

<Modal
  title="Claim"
  {isOpen}
  validateButtonLabel="Claim"
  on:modalClosed={dispatchClosed}
  on:modalValidated={claim}
>
  <p>You received a transfer of {amount} from {senderAddress}</p>
  <LabelInput
    label={question}
    placeholder="Your answer here..."
    bind:value={answer}
  />
</Modal>

<style lang="scss">
</style>
