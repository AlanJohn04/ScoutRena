import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy TalentToken
  const TalentToken = await hre.ethers.getContractFactory("TalentToken");
  const talentToken = await TalentToken.deploy();
  await talentToken.waitForDeployment();
  const tokenAddress = await talentToken.getAddress();
  console.log("TalentToken deployed to:", tokenAddress);

  // 2. Deploy SoulBoundToken
  const SoulBoundToken = await hre.ethers.getContractFactory("SoulBoundToken");
  const soulBoundToken = await SoulBoundToken.deploy();
  await soulBoundToken.waitForDeployment();
  const sbtAddress = await soulBoundToken.getAddress();
  console.log("SoulBoundToken deployed to:", sbtAddress);

  // 3. Deploy ScoutRenaMarket
  const ScoutRenaMarket = await hre.ethers.getContractFactory("ScoutRenaMarket");
  const scoutRenaMarket = await ScoutRenaMarket.deploy(tokenAddress);
  await scoutRenaMarket.waitForDeployment();
  const marketAddress = await scoutRenaMarket.getAddress();
  console.log("ScoutRenaMarket deployed to:", marketAddress);

  // Save the contract addresses and ABIs to the frontend source for ease of imports
  const configDir = path.join(__dirname, "../src/lib/contracts");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const addresses = {
    TalentToken: tokenAddress,
    SoulBoundToken: sbtAddress,
    ScoutRenaMarket: marketAddress,
  };

  fs.writeFileSync(
    path.join(configDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("Contract addresses saved to src/lib/contracts/addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
