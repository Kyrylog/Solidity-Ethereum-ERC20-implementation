import { expect, assert } from 'chai';
import { ethers } from 'hardhat';

describe('Khlopiachyi', function () {
  it("Should return correct symbol", async function () {
    const Khlopiachyi = await ethers.getContractFactory('Khlopiachyi');
    const token = await Khlopiachyi.deploy();
    await token.deployed();

    expect(await token.symbol()).to.be.equal('KHL');
  });

  it("Should mint correct amount to contract's owner after contract deployment", async function () {
    const Khlopiachyi = await ethers.getContractFactory('Khlopiachyi');
    const token = await Khlopiachyi.deploy();
    await token.deployed();

    const [owner] = await ethers.getSigners();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.be.equal(50000);
  });

  it("Should mint correct amount to contract's owner after contract deployment", async function () {
    const Khlopiachyi = await ethers.getContractFactory('Khlopiachyi');
    const token = await Khlopiachyi.deploy();
    await token.deployed();

    const [owner] = await ethers.getSigners();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.be.equal(50000);
  });

  it("Should mint correct amount of KHL to msg.sender and return correct holder balance", async function () {
    const Khlopiachyi = await ethers.getContractFactory('Khlopiachyi');
    const token = await Khlopiachyi.deploy();
    await token.deployed();
    const [_owner, ...accounts] = await ethers.getSigners();

    const initialBalance = await token.balanceOf(accounts[0].address);
    expect(initialBalance).to.be.equal(0);

    const initialHolderBalance = await token.connect(accounts[0]).getTokenHolderBalance();
    expect(initialHolderBalance).to.be.equal(initialBalance);

    // try to send initial call of sendTokens transaction
    await token.connect(accounts[0]).sendTokens({
      value: ethers.utils.parseEther("1"),
    });

    const balance = await token.balanceOf(accounts[0].address);
    expect(balance).to.be.equal(100);

    const holderBalance = await token.connect(accounts[0]).getTokenHolderBalance();
    expect(holderBalance).to.be.equal(balance);

    // try to send second call of sendTokens transaction
    await token.connect(accounts[0]).sendTokens({
      value: ethers.utils.parseEther("0.5"),
    });

    const balanceAfterSecondCall = await token.balanceOf(accounts[0].address);
    expect(balanceAfterSecondCall).to.be.equal(150);

    const holderBalanceAfterSecondCall = await token.connect(accounts[0]).getTokenHolderBalance();
    expect(holderBalanceAfterSecondCall).to.be.equal(balanceAfterSecondCall);

    // try to send big amount to have total > 500
    try {
      await token.connect(accounts[0]).sendTokens({
        value: ethers.utils.parseEther("100"),
      });

      assert(false);
    } catch (error) {
      assert(error);
    }

    const balanceAfterFailedCall = await token.balanceOf(accounts[0].address);
    expect(balanceAfterFailedCall).to.be.equal(150);

    const holderBalanceAfterFailedCall = await token.connect(accounts[0]).getTokenHolderBalance();
    expect(holderBalanceAfterFailedCall).to.be.equal(holderBalanceAfterFailedCall);
  });
});
