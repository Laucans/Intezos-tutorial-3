<script>
  import Modal from "./base/Modal.svelte";

  import { createEventDispatcher } from "svelte";

  // Modal properties
  export let isOpen = false;
  export let modalTitle = "default title";
  export let modalText = "default text";

  // Modal form data
  let answer = undefined;

  // Event
  const dispatch = createEventDispatcher();

  function dispatchClosed(event) {
    dispatch("modalClosed", event.detail);
  }

  function dispatchConfirm(event) {
    dispatch("modalConfirmed", event.detail);
    dispatchClosed(event);
  }
</script>

<Modal
  title={modalTitle}
  {isOpen}
  validateButtonLabel="Confirm"
  on:modalClosed={dispatchClosed}
  on:modalValidated={dispatchConfirm}
>
  <p>{modalText}</p>
</Modal>

<style lang="scss">
</style>
