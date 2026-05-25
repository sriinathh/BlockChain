const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with deployer address:", deployer.address);

  // Deploy MetaToken
  const initialSupply = hre.ethers.parseUnits("10000000", 18); // 10 million MBT
  const MetaToken = await hre.ethers.getContractFactory("MetaToken");
  const token = await MetaToken.deploy(initialSupply);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MetaToken deployed to:", tokenAddress);

  // Deploy NFTBankCard
  const NFTBankCard = await hre.ethers.getContractFactory("NFTBankCard");
  const nft = await NFTBankCard.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("NFTBankCard deployed to:", nftAddress);

  // Deploy MetaBank
  const MetaBank = await hre.ethers.getContractFactory("MetaBank");
  const bank = await MetaBank.deploy(tokenAddress);
  await bank.waitForDeployment();
  const bankAddress = await bank.getAddress();
  console.log("MetaBank deployed to:", bankAddress);

  // Set MetaBank as owner of MetaToken so it can mint rewards
  console.log("Transferring MetaToken ownership to MetaBank...");
  const tx = await token.transferOwnership(bankAddress);
  await tx.wait();
  console.log("MetaToken ownership transferred to MetaBank.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
