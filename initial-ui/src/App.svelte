<script lang="ts">
  import store from "./store";
  import Sidebar from "./lib/sidebar/Sidebar.svelte";
  import Interface from "./lib/interface/Interface.svelte";
  import Toast from "./lib/interface/Toast.svelte";
</script>

<main>
  <Toast />
  {#if $store.Tezos}
    <Sidebar />
    <Interface />
  {:else}
    <div>Loading</div>
  {/if}
</main>

<style lang="scss">
  @import "./styles/settings.scss";

  main {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: $padding;
    padding: $padding;
    height: calc(100% - (#{$padding} * 2));
  }
  @media screen and (max-height: 700px) {
    main {
      padding: 0px;
      height: 100%;
    }
  }
</style>
