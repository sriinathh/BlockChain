async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with', deployer.address);
  const Token = await ethers.getContractFactory('MetaBankToken');
  const token = await Token.deploy(ethers.parseUnits('1000000', 18));
  await token.deployed();
  console.log('Token deployed to', token.target);
  const MetaBank = await ethers.getContractFactory('MetaBank');
  const bank = await MetaBank.deploy(token.target);
  await bank.deployed();
  console.log('MetaBank deployed to', bank.target);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
