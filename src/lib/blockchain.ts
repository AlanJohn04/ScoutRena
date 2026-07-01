import { ethers } from "ethers";
import addresses from "./contracts/addresses.json";
import TalentTokenABI from "./contracts/abis/TalentToken.json";
import SoulBoundTokenABI from "./contracts/abis/SoulBoundToken.json";
import ScoutRenaMarketABI from "./contracts/abis/ScoutRenaMarket.json";

const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return new ethers.JsonRpcProvider(LOCAL_RPC_URL);
}

export async function getSigner() {
  const provider = getProvider();
  if (provider instanceof ethers.BrowserProvider) {
    return await provider.getSigner();
  }
  // Fallback to Hardhat Account #0 for local server-side operations / mock simulation
  const rpcProvider = provider as ethers.JsonRpcProvider;
  return await rpcProvider.getSigner(0);
}

export function getTalentTokenContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(addresses.TalentToken, TalentTokenABI, signerOrProvider);
}

export function getSoulBoundTokenContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(addresses.SoulBoundToken, SoulBoundTokenABI, signerOrProvider);
}

export function getScoutRenaMarketContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(addresses.ScoutRenaMarket, ScoutRenaMarketABI, signerOrProvider);
}

// Helper to format token values (decimate)
export function formatTT(value: bigint | number | string) {
  return ethers.formatUnits(value, 18);
}

// Helper to parse token values (wei)
export function parseTT(value: string) {
  return ethers.parseUnits(value, 18);
}
