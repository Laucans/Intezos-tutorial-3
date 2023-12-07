<script lang="ts">
  import ClaimList from "./list/ClaimList.svelte";
  import RedeemList from "./list/RedeemList.svelte";
</script>

<div class="interface-container">
  <div>
    <h1>Transfer :</h1>
    <ClaimList />
  </div>

  <div>
    <h1>Redeem :</h1>
    <RedeemList />
  </div>
</div>

<style lang="scss">
  .interface-container {
    display: grid;
    grid-template-rows: auto 60% 20%;
    justify-items: center;
    align-items: center;
  }
</style>
