<script lang="ts">
  import Modal from "./base/Modal.svelte";
  import LabelInput from "../inputs/LabelInput.svelte";
  import { createEventDispatcher } from "svelte";
  import type {
    IntezosWalletType,
    TransferParam,
  } from "../contracts/types/intezos.types";
  import store from "../../store";
  import { intezosAddress } from "../../config";
  import { createHash } from "crypto";
  import { tas } from "../contracts/types/type-aliases";
  import { packData, type MichelsonType } from "@taquito/michel-codec";
  // Modal properties
  export let isOpen = false;

  // Modal form data
  let recipientAddress = undefined;
  let amount = undefined;
  let reason = undefined;
  let secretQuestion = undefined;
  let secretAnswer = undefined;

  // Event
  const dispatch = createEventDispatcher();

  function dispatchClosed(event) {
    dispatch("modalTransferClosed", event.detail);
  }

  const hashSha256String = (string: string) => {
    const typ: MichelsonType = {
      prim: "string",
    };
    const data = {
      string,
    };
    const packed = packData(data, typ);
    const buffer = Buffer.from(packed);
    const hash = createHash("sha256").update(buffer).digest("hex");
    return "0x" + hash;
  };

  async function sendTransfer(event) {
    //TODO
  }
</script>

<Modal
  title="Transfer"
  {isOpen}
  validateButtonLabel="Send new transfer"
  on:modalClosed={dispatchClosed}
  on:modalValidated={sendTransfer}
>
  <LabelInput
    label="Recipient address"
    placeholder="tzxxxx"
    bind:value={recipientAddress}
  />
  <LabelInput label="Amount" placeholder="xtz" bind:value={amount} />
  <LabelInput label="Reason" placeholder="" bind:value={reason} />
  <LabelInput label="Question" placeholder="..." bind:value={secretQuestion} />
  <LabelInput label="Answer" placeholder="..." bind:value={secretAnswer} />
</Modal>

<style lang="scss">
</style>
