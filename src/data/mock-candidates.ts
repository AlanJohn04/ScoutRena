export interface Candidate {
  id: string;
  name: string;
  role: string;
  college: string;
  avatar: string;
  cpi: number;
  potentialScore: number;
  demandIndex: number;
  growthRate: number;
  riskScore: "Low" | "Medium" | "High";
  currentValue: number;
  highestBid: number;
  highestBidder: string;
  pendingBids: Array<{ company: string; amount: number; timestamp: string }>;
  skills: string[];
  cpiDetails: {
    problemSolving: number;
    engineering: number;
    learningAgility: number;
    innovation: number;
    collaboration: number;
    delivery: number;
    domainExpertise: number;
  };
  valueHistory: Array<{ date: string; value: number }>;
  badges: Array<{ id: string; name: string; description: string; type: string; color: string; verified: boolean; imageURI?: string }>;
  compatibility: { [key: string]: number };
  insights: string;
  acceptedOffer?: { company: string; amount: number; timestamp: string };
  githubStats: {
    commits: number;
    stars: number;
    prs: number;
    streak: number;
  };
}

export const mockCandidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "Ayush Sharma",
    role: "Blockchain Developer",
    college: "CUSAT",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    cpi: 94,
    potentialScore: 97,
    demandIndex: 92,
    growthRate: 18,
    riskScore: "Low",
    currentValue: 4200,
    highestBid: 2400,
    highestBidder: "Adobe",
    pendingBids: [
      { company: "Microsoft", amount: 1200, timestamp: "2026-06-14" },
      { company: "Amazon", amount: 1800, timestamp: "2026-06-15" },
      { company: "Adobe", amount: 2400, timestamp: "2026-06-15" }
    ],
    skills: ["React", "TypeScript", "Node.js", "Docker", "Solidity", "Hardhat", "Go"],
    cpiDetails: {
      problemSolving: 95,
      engineering: 96,
      learningAgility: 90,
      innovation: 92,
      collaboration: 85,
      delivery: 90,
      domainExpertise: 95
    },
    valueHistory: [
      { date: "Jan", value: 2400 },
      { date: "Feb", value: 2750 },
      { date: "Mar", value: 3400 },
      { date: "Apr", value: 3800 },
      { date: "May", value: 4100 },
      { date: "Jun", value: 4200 }
    ],
    badges: [
      { id: "b1", name: "First Blood", description: "First verified Solidity project", type: "First Blood", color: "#00ff88", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicvjk2jjxapwz367fainadzmsefqlrw2pxuxc3rynkdanoa2oqtfu" },
      { id: "b2", name: "Hackathon Warrior", description: "Won CUSAT Web3 Hackathon", type: "Hackathon Winner", color: "#00d4ff", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm" },
      { id: "b3", name: "Open Source Pioneer", description: "Merged PR in ethers.js", type: "Open Source", color: "#ffaa00", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicvjk2jjxapwz367fainadzmsefqlrw2pxuxc3rynkdanoa2oqtfu" },
      { id: "b4", name: "Streak Master", description: "42-day coding streak on Github", type: "Streak", color: "#ff3366", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm" }
    ],
    compatibility: {
      "Google": 98,
      "Amazon": 94,
      "Adobe": 92,
      "TCS": 81,
      "Infosys": 76
    },
    insights: "Your valuation increased by 18% because your smart contract optimization projects align with high-demand web3 hiring clusters. Adding Rust is predicted to increase your value by another 15%.",
    githubStats: {
      commits: 412,
      stars: 84,
      prs: 23,
      streak: 42
    }
  },
  {
    id: "candidate-2",
    name: "Priya Nair",
    role: "Machine Learning Engineer",
    college: "IIT Madras",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    cpi: 96,
    potentialScore: 99,
    demandIndex: 96,
    growthRate: 31,
    riskScore: "Low",
    currentValue: 5400,
    highestBid: 3100,
    highestBidder: "Google",
    pendingBids: [
      { company: "Amazon", amount: 2200, timestamp: "2026-06-12" },
      { company: "Google", amount: 3100, timestamp: "2026-06-14" }
    ],
    skills: ["Python", "PyTorch", "Hugging Face", "Docker", "SQL", "FastAPI", "React"],
    cpiDetails: {
      problemSolving: 98,
      engineering: 99,
      learningAgility: 95,
      innovation: 96,
      collaboration: 80,
      delivery: 92,
      domainExpertise: 96
    },
    valueHistory: [
      { date: "Jan", value: 3100 },
      { date: "Feb", value: 3500 },
      { date: "Mar", value: 4200 },
      { date: "Apr", value: 4700 },
      { date: "May", value: 5100 },
      { date: "Jun", value: 5400 }
    ],
    badges: [
      { id: "b5", name: "AI Master", description: "Created custom LLM fine-tuning repo", type: "AI Specialization", color: "#a855f7", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreifyv25g6ljkb7evesvyl5eggwzo435yjyhse2gv2eggc6meyatjyi" },
      { id: "b2", name: "Hackathon Warrior", description: "1st Place Smart India Hackathon", type: "Hackathon Winner", color: "#00d4ff", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm" },
      { id: "b6", name: "Blue Lock Elite", description: "Top 5 Global ML ranking", type: "Ranking", color: "#ffaa00", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreifyv25g6ljkb7evesvyl5eggwzo435yjyhse2gv2eggc6meyatjyi" }
    ],
    compatibility: {
      "Google": 99,
      "Amazon": 96,
      "Adobe": 88,
      "TCS": 74,
      "Infosys": 70
    },
    insights: "Priya is currently ranked #2 globally. Her custom transformer model implementation is attracting high interest from AI research companies, driving value up by 31% this week.",
    githubStats: {
      commits: 624,
      stars: 243,
      prs: 12,
      streak: 58
    }
  },
  {
    id: "candidate-3",
    name: "Vikram Malhotra",
    role: "Fullstack Engineer",
    college: "VIT Vellore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    cpi: 74,
    potentialScore: 91,
    demandIndex: 85,
    growthRate: 24,
    riskScore: "Medium",
    currentValue: 3200,
    highestBid: 1400,
    highestBidder: "TCS",
    pendingBids: [
      { company: "TCS", amount: 1400, timestamp: "2026-06-15" }
    ],
    skills: ["Javascript", "React", "Next.js", "Express", "PostgreSQL", "HTML/CSS"],
    cpiDetails: {
      problemSolving: 70,
      engineering: 94,
      learningAgility: 65,
      innovation: 85,
      collaboration: 50,
      delivery: 80,
      domainExpertise: 88
    },
    valueHistory: [
      { date: "Jan", value: 1800 },
      { date: "Feb", value: 2000 },
      { date: "Mar", value: 2200 },
      { date: "Apr", value: 2600 },
      { date: "May", value: 3000 },
      { date: "Jun", value: 3200 }
    ],
    badges: [
      { id: "b1", name: "First Blood", description: "Created verified fullstack SaaS app", type: "First Blood", color: "#00ff88", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm" },
      { id: "b7", name: "Hidden Gem", description: "Discovered as high potential talent", type: "Hidden Gem", color: "#ffaa00", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicvjk2jjxapwz367fainadzmsefqlrw2pxuxc3rynkdanoa2oqtfu" }
    ],
    compatibility: {
      "Google": 82,
      "Amazon": 85,
      "Adobe": 89,
      "TCS": 92,
      "Infosys": 88
    },
    insights: "Hidden Gem Alert: Vikram has a moderate current resume rank but his project velocity and code scores suggest 91/100 Future Potential. Valued at only 3200 TT, he is highly underpriced.",
    githubStats: {
      commits: 182,
      stars: 12,
      prs: 4,
      streak: 15
    }
  },
  {
    id: "candidate-4",
    name: "Rohan Das",
    role: "DevOps Engineer",
    college: "CUSAT",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    cpi: 88,
    potentialScore: 92,
    demandIndex: 90,
    growthRate: 15,
    riskScore: "Low",
    currentValue: 3900,
    highestBid: 2100,
    highestBidder: "Amazon",
    pendingBids: [
      { company: "Amazon", amount: 2100, timestamp: "2026-06-15" }
    ],
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Bash", "Python"],
    cpiDetails: {
      problemSolving: 89,
      engineering: 90,
      learningAgility: 88,
      innovation: 78,
      collaboration: 65,
      delivery: 90,
      domainExpertise: 92
    },
    valueHistory: [
      { date: "Jan", value: 2800 },
      { date: "Feb", value: 3000 },
      { date: "Mar", value: 3200 },
      { date: "Apr", value: 3500 },
      { date: "May", value: 3700 },
      { date: "Jun", value: 3900 }
    ],
    badges: [
      { id: "b8", name: "Cloud Guardian", description: "Created fully automated GitOps pipeline", type: "Infrastructure", color: "#3b82f6", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicvjk2jjxapwz367fainadzmsefqlrw2pxuxc3rynkdanoa2oqtfu" },
      { id: "b2", name: "Hackathon Warrior", description: "Won AWS Community Hack", type: "Hackathon Winner", color: "#00d4ff", verified: true, imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm" }
    ],
    compatibility: {
      "Google": 92,
      "Amazon": 98,
      "Adobe": 91,
      "TCS": 84,
      "Infosys": 80
    },
    insights: "Rohan's active automated setup for multi-region clustering has caught interest from cloud providers, leading to a steady 15% valuation growth this month.",
    githubStats: {
      commits: 298,
      stars: 45,
      prs: 18,
      streak: 30
    }
  }
];
