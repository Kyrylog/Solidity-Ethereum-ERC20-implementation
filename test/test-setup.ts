import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { KotsiubaToken, KotsiubaToken__factory } from "../typechain";

export const deployParams = {
  maxTokenAllowed: parseEther("500"),
  tokenRate: BigNumber.from(100),
};

export const setupContract = async (
  tokenOwnerWallet: SignerWithAddress
): Promise<KotsiubaToken> => {
  const token = await new KotsiubaToken__factory(tokenOwnerWallet).deploy(
    deployParams.maxTokenAllowed,
    deployParams.tokenRate
  );

  return token;
};
