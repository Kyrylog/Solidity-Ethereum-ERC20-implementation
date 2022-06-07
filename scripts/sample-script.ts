// We require the Hardhat Runtime Environment explicitly here. This is optional
import { ethers } from 'hardhat';
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const MyERC20 = await ethers.getContractFactory("KhlopiachyiToken");
  const erc20 = await MyERC20.deploy('Khlopichyi Pavlo', 'KHLP', 100000000);

  await erc20.deployed();

  console.log("MyERC20 deployed to:", erc20.address);

  const TokenHandler = await ethers.getContractFactory('TokenHandler');
  const handler = await TokenHandler.deploy(erc20.address, 100, 500);

  await handler.deployed();

  console.log('TokenHandler deployed to:', handler.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
