const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  const WalletStorage = await hre.ethers.getContractFactory('WalletStorage');
  const deployed = await WalletStorage.deploy();
  await deployed.waitForDeployment();
  console.log('WalletStorage deployed to:', deployed.target || deployed.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
