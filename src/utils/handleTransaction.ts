import { ethers, type TransactionResponse } from "ethers";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

const PROVIDER_RPC_URL = "https://eth-sepolia.public.blastapi.io";

const apiKit = new SafeApiKit({
  chainId: BigInt(11155111),
});

const safeAddress = "0x459364262cdF91c7f95C6ec8Bdb8F3F0055a3268"; // Deployed SAFE Address on Sepolia

export async function createTransaction() {
  const protocolKit = await Safe.init({
    provider: PROVIDER_RPC_URL,
    signer: process.env.NEXT_PUBLIC_OWNER_1_PRIVATE_KEY,
    safeAddress,
  });

  const receiverAddress = "0xD720205354C0b922666aAf6113C45eF8026a409E"; // Choosing personal account to receive ETH
  const amount = ethers.parseUnits("0.0005", "ether").toString();

  const safeTransactionData: MetaTransactionData = {
    to: receiverAddress,
    data: "0x",
    value: amount,
  };

  const safeTransaction = await protocolKit.createTransaction({
    transactions: [safeTransactionData],
  });

  const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
  const senderSignature = await protocolKit.signHash(safeTxHash);

  await apiKit.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: "0x7A3dc66ABE45912b236982Fe60D76655602A74A4",
    senderSignature: senderSignature.data,
  });

  const pendingTransactions = (await apiKit.getPendingTransactions(safeAddress))
    .results;

  const transaction = pendingTransactions[0];
  const proposeTxHash = transaction.safeTxHash;

  const protocolKitOwner2 = await Safe.init({
    provider: PROVIDER_RPC_URL,
    signer: process.env.NEXT_PUBLIC_OWNER_2_PRIVATE_KEY,
    safeAddress,
  });

  const signature = await protocolKitOwner2.signHash(proposeTxHash);
  const response = await apiKit.confirmTransaction(
    proposeTxHash,
    signature.data
  );

  return proposeTxHash;
}

export async function executeTransaction(proposeTxHash: string) {
  const protocolKit = await Safe.init({
    provider: PROVIDER_RPC_URL,
    signer: process.env.NEXT_PUBLIC_OWNER_1_PRIVATE_KEY,
    safeAddress,
  });

  const executeSafeTransaction = await apiKit.getTransaction(proposeTxHash);
  const executeTxResponse = await protocolKit.executeTransaction(
    executeSafeTransaction
  );
  const receipt =
    (await executeTxResponse.transactionResponse) as TransactionResponse;

  const afterBalance = await protocolKit.getBalance();

  return {
    balance: ethers.formatUnits(afterBalance, "ether"),
    hash: receipt.hash,
  };
}
