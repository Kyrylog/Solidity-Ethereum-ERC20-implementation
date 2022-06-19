import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import hre from "hardhat";
import { KotsiubaToken } from "../typechain";

import { checkContractOwner } from "./test-helpers";
import { deployParams, setupContract } from "./test-setup";

const ERRORS = {
  OWNABLE_NOT_OWNER: "Ownable: caller is not the owner",
  TOKEN_TRANSFER_AMOUNT_EXCEEDS_MAX_TOKEN_ALLOWED:
    "KotsiubaToken: transfer amount exceeds max token allowed",
};

describe("KotsiubaToken", () => {
  let token: KotsiubaToken;
  let tokenOwnerWallet: SignerWithAddress;
  let bobWallet: SignerWithAddress;

  beforeEach(async () => {
    [tokenOwnerWallet, bobWallet] = await hre.ethers.getSigners();

    token = await setupContract(tokenOwnerWallet);
  });

  describe("maxTokenAllowed - public", () => {
    it("success", async () => {
      const maxTokenAllowed = await token
        .connect(tokenOwnerWallet)
        .maxTokenAllowed();
      expect(maxTokenAllowed).to.be.eq(deployParams.maxTokenAllowed);
    });
  });

  describe("tokenRate - public", () => {
    it("success", async () => {
      const tokenRate = await token.connect(tokenOwnerWallet).tokenRate();
      expect(tokenRate).to.be.eq(deployParams.tokenRate);
    });
  });

  describe("mint - onlyOwner", () => {
    it("fail - not owner", async () => {
      const actionWallet = bobWallet;
      const tokensToMint = parseEther("100");

      const totalSypplyBefore = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceBefore = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      await checkContractOwner(actionWallet.address, token, false);

      await expect(
        token.connect(actionWallet).mint(actionWallet.address, tokensToMint)
      ).to.be.revertedWith(ERRORS.OWNABLE_NOT_OWNER);

      const totalSupplyAfter = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceAfter = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      expect(totalSupplyAfter).to.be.eq(totalSypplyBefore);
      expect(totalSupplyAfter).not.be.eq(tokensToMint);
      expect(actionWalletBalanceAfter).to.be.eq(actionWalletBalanceBefore);
    });

    it("fail - exceeds max token allowed", async () => {
      const actionWallet = tokenOwnerWallet;
      const tokensToMint = parseEther("1000");

      const totalSypplyBefore = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceBefore = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      await checkContractOwner(actionWallet.address, token, true);

      await expect(
        token.connect(actionWallet).mint(actionWallet.address, tokensToMint)
      ).to.be.revertedWith(
        ERRORS.TOKEN_TRANSFER_AMOUNT_EXCEEDS_MAX_TOKEN_ALLOWED
      );

      const totalSupplyAfter = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceAfter = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      expect(totalSupplyAfter).to.be.eq(totalSypplyBefore);
      expect(totalSupplyAfter).not.be.eq(tokensToMint);
      expect(actionWalletBalanceAfter).to.be.eq(actionWalletBalanceBefore);
    });

    it("success", async () => {
      const actionWallet = tokenOwnerWallet;
      const tokensToMint = parseEther("100");

      const totalSypplyBefore = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceBefore = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      await checkContractOwner(actionWallet.address, token, true);

      await expect(
        token.connect(actionWallet).mint(actionWallet.address, tokensToMint)
      ).not.to.be.reverted;

      const totalSupplyAfter = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceAfter = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);

      expect(totalSupplyAfter).not.to.be.eq(totalSypplyBefore);
      expect(actionWalletBalanceAfter).not.to.be.eq(actionWalletBalanceBefore);
      expect(totalSupplyAfter).to.be.eq(totalSypplyBefore.add(tokensToMint));
      expect(actionWalletBalanceAfter).to.be.eq(
        actionWalletBalanceBefore.add(tokensToMint)
      );
    });
  });

  describe("receive", () => {
    it("fail - exceeds max token allowed", async () => {
      const actionWallet = bobWallet;
      const etherToSend = parseEther("10");
      const expectedTokens = etherToSend.mul(deployParams.tokenRate);

      const totalSypplyBefore = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceBefore = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);
      const actionWalletEtherBefore = await actionWallet.getBalance();

      await expect(
        actionWallet.sendTransaction({ to: token.address, value: etherToSend })
      ).to.be.revertedWith(
        ERRORS.TOKEN_TRANSFER_AMOUNT_EXCEEDS_MAX_TOKEN_ALLOWED
      );

      const totalSupplyAfter = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceAfter = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);
      const actionWalletEtherAfter = await actionWallet.getBalance();

      expect(totalSupplyAfter).to.be.eq(totalSypplyBefore);
      expect(actionWalletBalanceAfter).to.be.eq(actionWalletBalanceBefore);
      expect(actionWalletEtherAfter).to.be.eq(actionWalletEtherBefore);
      expect(actionWalletBalanceAfter).not.to.be.eq(expectedTokens);
    });

    it("success", async () => {
      const actionWallet = bobWallet;
      const etherToSend = parseEther("5");
      const expectedTokens = etherToSend.mul(deployParams.tokenRate);

      const totalSypplyBefore = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceBefore = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);
      const actionWalletEtherBefore = await actionWallet.getBalance();

      await expect(
        actionWallet.sendTransaction({ to: token.address, value: etherToSend })
      ).not.to.be.reverted;

      const totalSupplyAfter = await token.connect(actionWallet).totalSupply();
      const actionWalletBalanceAfter = await token
        .connect(actionWallet)
        .balanceOf(actionWallet.address);
      const actionWalletEtherAfter = await actionWallet.getBalance();

      expect(totalSupplyAfter).not.to.be.eq(totalSypplyBefore);
      expect(actionWalletBalanceAfter).not.to.be.eq(actionWalletBalanceBefore);
      expect(actionWalletEtherAfter).not.to.be.eq(actionWalletEtherBefore);
      expect(actionWalletBalanceAfter).to.be.eq(expectedTokens);
    });
  });
});
