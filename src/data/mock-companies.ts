export interface Company {
  id: string;
  name: string;
  logo: string;
  domain: string;
  tokenBalance: number;
  activeBids: number;
  trialInternships: number;
  followingCandidates: string[]; // List of candidate IDs
}

export const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    domain: "AI & Search",
    tokenBalance: 154000,
    activeBids: 8,
    trialInternships: 3,
    followingCandidates: ["candidate-1", "candidate-2"]
  },
  {
    id: "company-2",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.svg",
    domain: "E-Commerce & Cloud",
    tokenBalance: 98000,
    activeBids: 12,
    trialInternships: 5,
    followingCandidates: ["candidate-2", "candidate-4"]
  },
  {
    id: "company-3",
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Adobe_Creative_Cloud_logo.svg",
    domain: "Creativity & Document Systems",
    tokenBalance: 45000,
    activeBids: 4,
    trialInternships: 2,
    followingCandidates: ["candidate-1"]
  },
  {
    id: "company-4",
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    domain: "IT & Services Consulting",
    tokenBalance: 250000,
    activeBids: 35,
    trialInternships: 18,
    followingCandidates: ["candidate-3"]
  }
];
