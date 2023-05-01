import { TransactionBlock } from "@mysten/sui.js";
import { TransactionBlockArgument, TransactionResult , txObj as txCommon } from "../../transaction";
import { GlobalParams } from "../types";
import { DEFAULT_TRANSFER_REQUEST_MODULE } from "../consts";
import { ConfirmParams } from "./types";

function txObj(
  fun: string,
  p: GlobalParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] {
  // eslint-disable-next-line no-undef
  return txCommon(
    {
      packageObjectId: p.packageObjectId ?? "0xa37b19d59b762ff0b03a790b48b918cb3b194eec795f0af212e1c199070efabd",
      moduleName: p.moduleName ?? DEFAULT_TRANSFER_REQUEST_MODULE,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}


export const confirmTx = (params: ConfirmParams) => {
  txObj(
    "confirm_transfer",
    {...params, moduleName: "transfer_allowlist", packageObjectId: params.nftProtocolContractId},
    (tx) => [
      tx.object(params.allowListId),
      typeof params.transferRequest === "string" ? tx.object(params.transferRequest) : params.transferRequest
    ],
    [params.transferRequestType]
  );
  txObj(
    "confirm_transfer",
    {...params, moduleName: "royalty_strategy_bps",  packageObjectId: params.nftProtocolContractId},
    (tx) => [
      tx.object(params.bpsRoyaltyStrategy),
      typeof params.transferRequest === "string" ? tx.object(params.transferRequest) : params.transferRequest
    ],
    [
      params.transferRequestType,
      params.ft
    ]
  );
  return txObj(
    "confirm", 
    {...params, moduleName: "transfer_request", packageObjectId: params.requestContractId}, 
    (tx) => [
      typeof params.transferRequest === "string" ? tx.object(params.transferRequest) : params.transferRequest,
      tx.object(params.policyId)
    ],
    [
      params.transferRequestType,
      params.ft
    ]
  )
}