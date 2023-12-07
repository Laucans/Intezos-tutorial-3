import { writable } from "svelte/store";
import { TezosToolkit } from "@taquito/taquito";
import type { token } from "./types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { network, rpcUrl } from "./config";
import type { int } from "./lib/contracts/types/type-aliases";

export type TezosContractAddress = `KT1${string}`;
export type TezosAccountAddress = `tz${"1" | "2" | "3"}${string}`;

interface State {
  Tezos: TezosToolkit;
  wallet: BeaconWallet;
  userAddress: TezosAccountAddress;
  userBalances: {
    XTZ: null | number;
  };
  contractStorageBigMapID: number;
  toast: { show: boolean; text: string };
  eventCount: number;
}

const initialState: State = {
  Tezos: new TezosToolkit(rpcUrl),
  wallet: new BeaconWallet({
    name: "Tezos dev portal dapp tutorial",
    preferredNetwork: network,
  }),
  userAddress: undefined,
  userBalances: undefined,
  contractStorageBigMapID: 0,
  toast: { show: false, text: "This is a test" },
  eventCount: 0,
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,

  updateTezos: (tezos: TezosToolkit) =>
    store.update((store) => ({ ...store, Tezos: tezos })),

  updateWallet: (wallet: BeaconWallet | undefined) =>
    store.update((store) => ({ ...store, wallet })),

  updateUserAddress: (address: TezosAccountAddress | undefined) => {
    store.update((store) => ({
      ...store,
      userAddress: address,
    }));
  },

  updateToast: (state: boolean, text: string) =>
    store.update((store) => ({
      ...store,
      toast: { show: state, text },
    })),

  showToast: (state: boolean) =>
    store.update((store) => ({
      ...store,
      toast: { show: state, text: !state ? "" : store.toast.text },
    })),

  updateUserBalances: (token: token, balance: null | number) =>
    store.update((store) => {
      if (balance >= 0) {
        return {
          ...store,
          userBalances: { ...store.userBalances, [token]: balance },
        };
      } else {
        return store;
      }
    }),

  updateEventCount: () =>
    store.update((store) => ({
      ...store,
      event: store.eventCount + 1,
    })),
};

export default state;
