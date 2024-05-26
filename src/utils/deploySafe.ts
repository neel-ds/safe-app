import { ethers } from "ethers";
import { SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";

export async function deploy() {
  const RPC_URL = "https://eth-sepolia.public.blastapi.io";
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const ownerSigner = new ethers.Wallet(
    process.env.OWNER_1_PRIVATE_KEY!,
    provider
  );

  const safeFactory = await SafeFactory.init({
    provider: RPC_URL,
    signer: process.env.OWNER_1_PRIVATE_KEY,
  });

  // Deploy a Safe
  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      "0x7A3dc66ABE45912b236982Fe60D76655602A74A4",
      "0xBa7152a5db1F0928e62B1F757397De6c4fd81f60",
      "0x7B7902eaf7299AA003D40b7EdcA14D4305eBeCD1",
    ],
    threshold: 2,
  };

  try {
    const protocolKit = await safeFactory.deploySafe({ safeAccountConfig });

    const safeAddress = await protocolKit.getAddress();

    const safeAmount = ethers.parseUnits("0.1", "ether").toString();

    const transactionParameters = {
      to: safeAddress,
      value: safeAmount,
    };

    const response = await ownerSigner.sendTransaction(transactionParameters);
    console.log(`https://sepolia.etherscan.io/tx/${response.hash}`);

    return safeAddress;
  } catch (error) {
    console.log(error);
    return error;
  }
}
