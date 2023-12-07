import { NetworkType } from "@airgap/beacon-types";
import type { TezosContractAddress } from "./store";

export const rpcUrl = "https://ghostnet.tezos.marigold.dev";
// export const rpcUrl = "https://mainnet.tezos.marigold.dev";
export const network = NetworkType.GHOSTNET;
export const indexerAPIURL= "https://api.ghostnet.tzkt.io/v1/";

export const intezosAddress =
  "" as TezosContractAddress; //TODO
export const contractStorageBigMapID = 0; //TODO

export const XTZ = {
  decimals: 6
};
