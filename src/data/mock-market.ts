export interface MarketIndex {
  id: string;
  name: string;
  supply: number;
  demand: number;
  multiplier: number;
  trend: "up" | "down" | "stable";
  growthRate: number;
}

export interface Transaction {
  hash: string;
  block: number;
  type: "Token Mint" | "Place Bid" | "Accept Bid" | "Mint SBT" | "Deposit";
  from: string;
  to: string;
  details: string;
  timestamp: string;
}

export const mockMarketIndices: MarketIndex[] = [
  {
    id: "idx-blockchain",
    name: "Web3 & Smart Contracts Index",
    supply: 1200,
    demand: 3200,
    multiplier: 1.8,
    trend: "up",
    growthRate: 12.4
  },
  {
    id: "idx-ai",
    name: "AI & Neural Networks Index",
    supply: 2400,
    demand: 5800,
    multiplier: 2.1,
    trend: "up",
    growthRate: 24.5
  },
  {
    id: "idx-devops",
    name: "Cloud Native & DevOps Index",
    supply: 4100,
    demand: 4900,
    multiplier: 1.2,
    trend: "up",
    growthRate: 8.2
  },
  {
    id: "idx-frontend",
    name: "Modern Frontend (React/Next) Index",
    supply: 12000,
    demand: 9000,
    multiplier: 0.85,
    trend: "down",
    growthRate: -2.1
  },
  {
    id: "idx-backend",
    name: "Backend Core (Node/Go/Rust) Index",
    supply: 8000,
    demand: 9500,
    multiplier: 1.15,
    trend: "up",
    growthRate: 4.8
  }
];

export const mockTransactions: Transaction[] = [
  {
    hash: "0x3f5c9...8e11a",
    block: 489201,
    type: "Place Bid",
    from: "Google Wallet (0xf39...66)",
    to: "Priya Nair Profile",
    details: "Bid placed: 3100 Talent Tokens",
    timestamp: "10 mins ago"
  },
  {
    hash: "0xe7a22...2b99d",
    block: 489198,
    type: "Mint SBT",
    from: "ScoutRena Admin",
    to: "Ayush Sharma Wallet",
    details: "SBT Badged: 'Streak Master' (42 days)",
    timestamp: "45 mins ago"
  },
  {
    hash: "0x88f21...c120f",
    block: 489182,
    type: "Accept Bid",
    from: "Ayush Sharma Wallet",
    to: "Adobe Escrow",
    details: "Bidding completed and locked at 2400 TT",
    timestamp: "3 hours ago"
  },
  {
    hash: "0x2e8f1...120aa",
    block: 489150,
    type: "Deposit",
    from: "Google Bank",
    to: "Google Wallet",
    details: "Purchased 50,000 Talent Tokens via Smart Contract",
    timestamp: "6 hours ago"
  },
  {
    hash: "0xba11c...78ee8",
    block: 489104,
    type: "Mint SBT",
    from: "ScoutRena Admin",
    to: "Vikram Malhotra Wallet",
    details: "SBT Badged: 'First Blood' (SaaS deployment)",
    timestamp: "12 hours ago"
  }
];

export const mockTickerData = [
  { name: "Ayush Sharma", symbol: "AYSH", value: "4,200 TT", change: "+18%", up: true },
  { name: "Priya Nair", symbol: "PRYA", value: "5,400 TT", change: "+31%", up: true },
  { name: "Vikram Malhotra", symbol: "VKRM", value: "3,200 TT", change: "+24%", up: true },
  { name: "Rohan Das", symbol: "ROHN", value: "3,900 TT", change: "+15%", up: true },
  { name: "Blockchain Index", symbol: "W3SC", value: "1.8x Multiplier", change: "+12.4%", up: true },
  { name: "AI Index", symbol: "AINN", value: "2.1x Multiplier", change: "+24.5%", up: true },
  { name: "Frontend Index", symbol: "FEWN", value: "0.85x Multiplier", change: "-2.1%", up: false }
];
