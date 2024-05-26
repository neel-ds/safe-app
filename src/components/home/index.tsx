"use client";

import Button from "@/components/common/button";
import {
  createTransaction,
  executeTransaction,
} from "@/utils/handleTransaction";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [enableTxExecution, setEnableTxExecution] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  async function handleTransactionEvent() {
    if (enableTxExecution) {
      setHash("");
      const response = await executeTransaction(txHash);
      setHash(response.hash);
      setBalance(response.balance);
    } else {
      const response = await createTransaction();
      setTxHash(response);
      setEnableTxExecution(true);
    }
    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-y-10 p-5 md:p-24">
      <h1 className="text-neutral-800 text-2xl font-semibold">
        Init and execute txn on Safe
      </h1>
      <Button
        id="handleTx"
        onClick={() => {
          setIsLoading(true);
          handleTransactionEvent();
        }}
        title={enableTxExecution ? "Execute Transaction" : "Create Transaction"}
        disabled={isLoading}
      />
      {txHash && (
        <p className="text-neutral-700">
          Transaction created - owners signed it ✅
        </p>
      )}
      {hash && (
        <span className="text-neutral-700 text-wrap">
          Transaction executed: Check on{" "}
          <Link
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            className="text-violet-600"
            target="_blank"
          >
            Etherscan
          </Link>{" "}
          |{" "}
          <Link
            href="https://app.safe.global/transactions/history?safe=sep:0x459364262cdF91c7f95C6ec8Bdb8F3F0055a3268"
            className="text-violet-600"
            target="_blank"
          >
            Safe Wallet
          </Link>{" "}
        </span>
      )}
      {balance && (
        <p className="text-neutral-700">Safe balance: {balance} ETH</p>
      )}
    </main>
  );
}
