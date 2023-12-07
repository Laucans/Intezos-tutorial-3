import { NetworkType } from "@airgap/beacon-types";
import type { TezosContractAddress } from "./store";

export const rpcUrl = "https://ghostnet.tezos.marigold.dev";
// export const rpcUrl = "https://mainnet.tezos.marigold.dev";
export const network = NetworkType.GHOSTNET;
export const indexerAPIURL= "https://api.ghostnet.tzkt.io/v1/";

export const intezosAddress =
  "KT1QgaNWKrE6ViZMipfbJipmLNYS17h11YJr" as TezosContractAddress;
export const contractStorageBigMapID = 393419;

export const XTZ = {
  decimals: 6
};
