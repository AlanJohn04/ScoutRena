import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactsDir = path.join(__dirname, "../artifacts/contracts");
const frontendAbisDir = path.join(__dirname, "../src/lib/contracts/abis");

if (!fs.existsSync(frontendAbisDir)) {
  fs.mkdirSync(frontendAbisDir, { recursive: true });
}

const contracts = [
  "TalentToken",
  "SoulBoundToken",
  "ScoutRenaMarket"
];

contracts.forEach(contractName => {
  const artifactPath = path.join(artifactsDir, `${contractName}.sol/${contractName}.json`);
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;
    fs.writeFileSync(
      path.join(frontendAbisDir, `${contractName}.json`),
      JSON.stringify(abi, null, 2)
    );
    console.log(`Copied ABI for ${contractName}`);
  } else {
    console.error(`Artifact not found for ${contractName} at ${artifactPath}`);
  }
});
