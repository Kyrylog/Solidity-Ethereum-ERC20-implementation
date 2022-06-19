import hre from "hardhat";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { KotsiubaToken__factory } from "../typechain";

async function main() {
  console.log("\nGet network");
  const network = await hre.ethers.provider.getNetwork();
  console.log(`Network chain id: ${network.chainId}`);
  console.log(`Network name: ${network.name}`);

  console.log("\nGet wallet");
  const wallet = (await hre.ethers.getSigners())[0];
  console.log(`Wallet address: ${wallet.address}`);

  console.log("\nDeploy token");
  const maxTokenAllowed: BigNumber = parseEther("500");
  const tokenRate: BigNumber = BigNumber.from(100);
  const deployParams = [maxTokenAllowed, tokenRate];
  console.log(`Deploy params: ${`"${deployParams.join('", "')}"` || "None"}`);

  console.log("Deploying...");
  const kotsiubaToken = await new KotsiubaToken__factory(wallet).deploy(
    maxTokenAllowed,
    tokenRate
  );
  await kotsiubaToken.deployed();

  console.log(`Deployed to address: ${kotsiubaToken.address}`);
  console.log(`Transaction id: ${kotsiubaToken.deployTransaction.hash}`);
  console.log("Waiting for confirmation transaction...");
  const transactionReceipt = await kotsiubaToken.deployTransaction.wait();
  console.log(
    `Transaction confirmed in block: ${transactionReceipt.blockNumber}`
  );
  console.log(`Transaction gas used: ${transactionReceipt.gasUsed}`);

  console.log("\nEtherscan verify script:");
  console.log(
    `npx hardhat verify --network ${network.name} ${
      kotsiubaToken.address
    } "${deployParams.join('" "')}"`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
