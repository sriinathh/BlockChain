import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reads deployed contract coordinates generated during hardhat deployments
let config = null;

const loadConfig = () => {
  const localPath = path.join(__dirname, "contractConfig.json");
  const fallbackPath = path.join(__dirname, "../config/contractConfig.json");
  
  let targetPath = "";
  if (fs.existsSync(localPath)) {
    targetPath = localPath;
  } else if (fs.existsSync(fallbackPath)) {
    targetPath = fallbackPath;
  }

  if (targetPath) {
    try {
      const fileContent = fs.readFileSync(targetPath, "utf8");
      return JSON.parse(fileContent);
    } catch (e) {
      console.error("Failed to parse contractConfig.json:", e.message);
    }
  }

  console.warn("contractConfig.json not found. Run hardhat deploy to generate ABIs.");
  return {
    addresses: {
      LandNFT: "0x0000000000000000000000000000000000000000",
      LandRegistry: "0x0000000000000000000000000000000000000000"
    },
    LandRegistryABI: [],
    LandNFTABI: []
  };
};

config = loadConfig();

export const registryAddress = config.addresses.LandRegistry;
export const nftAddress = config.addresses.LandNFT;
export const registryABI = config.LandRegistryABI;
export const nftABI = config.LandNFTABI;
