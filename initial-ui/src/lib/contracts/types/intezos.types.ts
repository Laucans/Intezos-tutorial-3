import type {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from "./type-utils";
import type { address, BigMap, bytes, mutez, timestamp } from "./type-aliases";

export type Storage = BigMap<{
  sender: address;
  receiver: address;
  transfer_timestamp: timestamp;
}, {
  amount: mutez;
  secret: {
    question: string;
    encrypted_answer: bytes;
    encryption_algorithm: string;
  };
  reason: string;
  pending: boolean;
}>;

export type TransferParam = {
  receiver: address;
  reason: string;
  secret: {
    question: string;
    encrypted_answer: bytes;
    encryption_algorithm: string;
  };
};

export type RedeemParam = {
  receiver: address;
  transfer_timestamp: timestamp;
};

export type ClaimParam = {
  sender: address;
  transfer_timestamp: timestamp;
  answer: bytes;
};

type Methods = {
  redeem: (
    receiver: address,
    transfer_timestamp: timestamp,
  ) => Promise<void>;
  claim: (
    sender: address,
    transfer_timestamp: timestamp,
    answer: bytes,
  ) => Promise<void>;
  transfer: (
    receiver: address,
    reason: string,
    secret: {
      question: string;
      encrypted_answer: bytes;
      encryption_algorithm: string;
    },
  ) => Promise<void>;
};

type MethodsObject = {
  redeem: (params: RedeemParam) => Promise<void>;
  claim: (params: ClaimParam) => Promise<void>;
  transfer: (params: TransferParam) => Promise<void>;
};

type contractTypes = {
  methods: Methods;
  methodsObject: MethodsObject;
  storage: Storage;
  code: { __type: "IntezosCode"; protocol: string; code: object[] };
};
export type IntezosContractType = ContractAbstractionFromContractType<
  contractTypes
>;
export type IntezosWalletType = WalletContractAbstractionFromContractType<
  contractTypes
>;
