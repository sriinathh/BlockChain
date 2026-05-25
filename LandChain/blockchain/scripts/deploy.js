import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("==================================================");
  console.log("Starting LandChain Smart Contract Deployment...");
  console.log(`Deploying Account: ${deployer.address}`);
  console.log(`Account Balance: ${hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);
  console.log("==================================================");

  // 1. Deploy LandNFT
  console.log("Deploying LandNFT Certificate Contract...");
  const LandNFT = await hre.ethers.getContractFactory("LandNFT");
  const landNFT = await LandNFT.deploy();
  await landNFT.waitForDeployment();
  const landNFTAddress = await landNFT.getAddress();
  console.log(`LandNFT deployed successfully at: ${landNFTAddress}`);

  // 2. Deploy LandRegistry passing NFT address
  console.log("Deploying LandRegistry Control Contract...");
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(landNFTAddress);
  await landRegistry.waitForDeployment();
  const landRegistryAddress = await landRegistry.getAddress();
  console.log(`LandRegistry deployed successfully at: ${landRegistryAddress}`);

  // 3. Bind NFT Contract Ownership to Registry
  console.log("Transferring LandNFT ownership to LandRegistry...");
  const tx = await landNFT.transferOwnership(landRegistryAddress);
  await tx.wait();
  console.log("Deed Title security loop locked successfully.");

  // Save contract addresses and ABIs for Frontend & Backend integrations
  const configData = {
    LandNFT: landNFTAddress,
    LandRegistry: landRegistryAddress
  };

  const registryArtifact = hre.artifacts.readArtifactSync("LandRegistry");
  const nftArtifact = hre.artifacts.readArtifactSync("LandNFT");

  const fullConfig = {
    addresses: configData,
    LandRegistryABI: registryArtifact.abi,
    LandNFTABI: nftArtifact.abi
  };

  // Directory exports
  const buildPaths = [
    path.join(__dirname, "../config"),
    path.join(__dirname, "../../client/src/services"),
    path.join(__dirname, "../../server/blockchain")
  ];

  buildPaths.forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dirPath, "contractConfig.json"),
      JSON.stringify(fullConfig, null, 2)
    );
    console.log(`Exported configuration & ABIs to: ${dirPath}`);
  });

  console.log("==================================================");
  console.log("Deployment Complete!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
